import { useState } from "react";

interface PollinationsImageOptions {
  width?: number;
  height?: number;
  seed?: number;
  model?: string;
  nologo?: boolean;
  enhance?: boolean;
}

export const usePollinationsImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async (
    prompt: string,
    options: PollinationsImageOptions = {}
  ): Promise<string> => {
    setIsGenerating(true);
    try {
      const {
        width = 1024,
        height = 1024,
        seed,
        model = "flux",
        nologo = true,
        enhance = true,
      } = options;

      // Build URL with parameters
      const params = new URLSearchParams({
        width: width.toString(),
        height: height.toString(),
        nologo: nologo.toString(),
        enhance: enhance.toString(),
        model,
      });

      if (seed) {
        params.append("seed", seed.toString());
      }

      // Encode the prompt for URL
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;

      // Preload the image to ensure it's generated
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      return imageUrl;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateImage, isGenerating };
};
