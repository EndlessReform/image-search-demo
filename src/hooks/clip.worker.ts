import {
  AutoProcessor,
  AutoTokenizer,
  CLIPVisionModelWithProjection,
  CLIPTextModelWithProjection,
  RawImage,
} from "@huggingface/transformers";

let processor: any, tokenizer: any, visionModel: any, textModel: any;

async function initializeModels() {
  try {
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

    self.postMessage({ type: "initialized" });
  } catch (error) {
    self.postMessage({ type: "error", error: (error as Error).message });
  }
}

async function embedImage(imageBlobs: Blob[]) {
  try {
    const images = await Promise.all(
      imageBlobs.map((blob) => RawImage.fromBlob(blob))
    );
    const imageInputs = await processor(images);
    const { image_embeds } = await visionModel(imageInputs);
    // Extract the actual number arrays from the tensor
    return image_embeds.tolist();
  } catch (error) {
    throw new Error(
      "An error occurred while embedding the image: " + (error as Error).message
    );
  }
}

async function embedText(text: string[]) {
  try {
    const textInputs = await tokenizer(text, {
      padding: true,
      truncation: true,
    });
    const { text_embeds } = await textModel(textInputs);
    // Extract the actual number arrays from the tensor
    return text_embeds.tolist();
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
        const result = await embedImage(payload);
        self.postMessage({ type: "imageEmbedding", result });
      } catch (error) {
        self.postMessage({ type: "error", error: (error as Error).message });
      }
      break;
    case "embedText":
      try {
        const result = await embedText(payload);
        self.postMessage({ type: "textEmbedding", result });
      } catch (error) {
        self.postMessage({ type: "error", error: (error as Error).message });
      }
      break;
  }
};

export {}; // This empty export is necessary to make TypeScript treat this as a module
