import { type Request, type Response } from "express"
import Thumbnail from "../models/Thumbnail.js";
import { type GenerateContentConfig, HarmCategory, HarmBlockThreshold } from "@google/genai";
import ai from "../configs/ai.js";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const stylePrompts: Record<string, string> = {
    "Bold & Graphic": "a bold and graphic style thumbnail with high-contrast colors, strong typography, dramatic visual elements, eye-catching composition, and striking shapes that demand attention",
    "Tech/Futuristic": "a tech-inspired futuristic style thumbnail with neon glows, holographic effects, circuit-board patterns, sleek metallic surfaces, digital aesthetics, and a sci-fi atmosphere",
    "Minimalist": "a clean minimalist style thumbnail with simple composition, ample whitespace, subtle color palette, elegant typography, and a refined uncluttered design",
    "Photorealistic": "a photorealistic style thumbnail with lifelike detail, natural lighting, realistic textures, cinematic depth of field, and professional photography quality",
    "Illustrated": "an illustrated style thumbnail with hand-drawn artistic elements, vibrant colors, creative character designs, expressive linework, and a playful artistic feel",
};

const colorSchemeDescriptions: Record<string, string> = {
    "vibrant": "using a vibrant color scheme with saturated, bold, and lively colors that pop with energy and excitement",
    "sunset": "using a warm sunset color scheme with rich oranges, deep reds, golden yellows, and soft pinks reminiscent of a glowing evening sky",
    "forest": "using a forest color scheme with deep greens, earthy browns, mossy tones, and natural woodland hues that evoke a lush outdoor atmosphere",
    "neon": "using a neon color scheme with bright electric blues, hot pinks, vivid greens, and glowing fluorescent tones on a dark background",
    "purple": "using a purple color scheme with rich violets, deep magentas, soft lavenders, and royal plum tones for an elegant and creative feel",
    "monochrome": "using a monochrome color scheme with varying shades of a single color, emphasizing contrast, depth, and sophisticated simplicity",
    "ocean": "using an ocean color scheme with deep navy blues, turquoise, aquamarine, seafoam greens, and crisp white accents inspired by the sea",
    "pastel": "using a pastel color scheme with soft, muted tones like baby blue, blush pink, mint green, and light lavender for a gentle and calming aesthetic",
};

// Controller for Generating Thumbnail
export const generateThumbnail = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay } = req.body;

        const thumbnail = await Thumbnail.create({ 
            userId, 
            title, 
            prompt_used: user_prompt, 
            user_prompt, 
            style, 
            aspect_ratio, 
            color_scheme,
            text_overlay,
            isGenerating: true 
        })

        const model = 'gemini-3.1-flash-image-preview';

        const generationConfig: GenerateContentConfig = {
            responseModalities: ['IMAGE'],
            imageConfig: {
                aspectRatio: aspect_ratio || '16:9',
                imageSize: '1K'
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
        }

        let prompt = `Create a ${stylePrompts[style as keyof typeof stylePrompts]} for: "${title}"`;

        if(color_scheme){
            prompt += `Use a ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]} color scheme.`
        }

        if(user_prompt){
            prompt += `Additional details: ${user_prompt}.`
        }

        prompt += `The thumbnail should be ${aspect_ratio}, visually stunning, and designed to maximize click-through rate. Make it bold, prefessional, attractive and impossible to ignore.`;

        // Generate the image using the ai model
        const response: any = await ai.models.generateContent({
            model,
            contents: [prompt],
            config: generationConfig
        })

        // Check if the resoonse is valid
        if(!response?.candidates?.[0]?.content?.parts){
            throw new Error('Unexpected response')
        }

        const parts = response.candidates[0].content.parts;

        let finalBuffer: Buffer | null = null;

        for(const part of parts){
            if(part.inlineData){
                finalBuffer = Buffer.from(part.inlineData.data, 'base64')
            }
        }

        const filename = `final-output-${Date.now()}.png`;
        const filePath = path.join('images', filename);

        // Create the images direcctory if it doesn't exist
        fs.mkdirSync('images', {recursive: true})

        // Write the final image to the file
        fs.writeFileSync(filePath, finalBuffer!);

        const uploadResult = await cloudinary.uploader.upload(filePath, {resource_type: 'image'});

        thumbnail.image_url = uploadResult.url;
        thumbnail.isGenerating = false;
        await thumbnail.save();

        res.json({message: 'Thumbnail Generated', thumbnail});

        // Remove image file from disk
        fs.unlinkSync(filePath);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// Controller for deleting Thumbnail
export const deleteThumbnail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;

        await Thumbnail.findByIdAndDelete({_id: id, userId})

        res.json({ message: "Thumbnail deleted successfully!"});
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
