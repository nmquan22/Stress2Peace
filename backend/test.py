from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

tokenizer = AutoTokenizer.from_pretrained(model_name,local_files_only=True)
model = AutoModelForCausalLM.from_pretrained(model_name,local_files_only=True)

chat = pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=200)

response = chat("review computer science")
print(response[0]["generated_text"])
