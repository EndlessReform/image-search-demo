import {
  AutoProcessor,
  Processor,
  AutoTokenizer,
  PreTrainedTokenizer,
  PreTrainedModel,
  CLIPVisionModelWithProjection,
  CLIPTextModelWithProjection,
  RawImage,
} from "@huggingface/transformers";

let processor: Processor,
  tokenizer: PreTrainedTokenizer,
  visionModel: PreTrainedModel,
  textModel: PreTrainedModel;

async function initializeModels() {
  try {
    const start = performance.now();
    processor = await AutoProcessor.from_pretrained(
      "Xenova/clip-vit-base-patch32"
    );
    tokenizer = await AutoTokenizer.from_pretrained("jinaai/jina-clip-v1");
    visionModel = await CLIPVisionModelWithProjection.from_pretrained(
      "Xenova/clip-vit-base-patch32"
    );
    textModel = await CLIPTextModelWithProjection.from_pretrained(
      "jinaai/jina-clip-v1"
    );
    const end = performance.now();

    self.postMessage({ type: "initialized", initTime: end - start });
  } catch (error) {
    self.postMessage({ type: "error", error: (error as Error).message });
  }
}

async function embedImage(imageBlobs: Blob[]) {
  try {
    const start = performance.now();
    const images = await Promise.all(
      imageBlobs.map((blob) => RawImage.fromBlob(blob))
    );
    const imageInputs = await processor(images);
    const { image_embeds } = await visionModel(imageInputs);
    const embeddings = image_embeds.tolist();
    const end = performance.now();
    return { embeddings, time: end - start };
  } catch (error) {
    throw new Error(
      "An error occurred while embedding the image: " + (error as Error).message
    );
  }
}

async function embedText(text: string[]) {
  try {
    const start = performance.now();
    const textInputs = await tokenizer(text, {
      padding: true,
      truncation: true,
    });
    const { text_embeds } = await textModel(textInputs);
    const embeddings = text_embeds.tolist();
    const end = performance.now();
    return { embeddings, time: end - start };
  } catch (error) {
    throw new Error(
      "An error occurred while embedding the text: " + (error as Error).message
    );
  }
}

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  switch (type) {
    case "initialize":
      await initializeModels();
      break;
    case "embedImage":
      try {
        const { embeddings, time } = await embedImage(payload);
        self.postMessage({ type: "imageEmbedding", result: embeddings, time });
      } catch (error) {
        self.postMessage({ type: "error", error: (error as Error).message });
      }
      break;
    case "embedText":
      try {
        const { embeddings, time } = await embedText(payload);
        self.postMessage({ type: "textEmbedding", result: embeddings, time });
      } catch (error) {
        self.postMessage({ type: "error", error: (error as Error).message });
      }
      break;
  }
};

export {};
