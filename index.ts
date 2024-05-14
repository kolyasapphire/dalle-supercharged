import { load } from "@std/dotenv";
import OpenAI from "https://deno.land/x/openai@v4.29.2/mod.ts";

const EXAMPLE =
  "OPENAI_TOKEN=abcd1234 deno run index.ts A gigantic shiba dog in the city";

await load({ export: true });

const apiKey = Deno.env.get("OPENAI_TOKEN");

if (!apiKey) {
  console.error("No OpenAI key specified, run like this:");
  console.log(EXAMPLE);
  Deno.exit();
}

if (!Deno.args.length) {
  console.error("No prompt! Run like this:");
  console.log(EXAMPLE);
  Deno.exit();
}

const PROMPT = Deno.args.join(" ");

const openai = new OpenAI({ apiKey });

const completion = await openai.chat.completions.create({
  // https://platform.openai.com/docs/models
  model: "gpt-4o",
  messages: [
    { role: "user", content: `Generate a DALL·E prompt for: ${PROMPT}` },
  ],
});
const query = completion.choices[0].message.content;

if (!query) {
  console.error("Failed to get a query");
  Deno.exit();
}

console.log("Generated query:");
console.log(query);

const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: query,
  n: 1,
  size: "1792x1024",
  quality: "hd",
});

const image = response.data[0].url;

if (!image) {
  console.error("Did not get an image back :(");
  Deno.exit();
}

console.log("Generated image:");
console.log(image);

const command = new Deno.Command("open", {
  args: [image],
});
command.spawn();
