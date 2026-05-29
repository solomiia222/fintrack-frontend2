import google.generativeai as genai

genai.configure(api_key="AIzaSyCunPVv3x3bwBwicCWd3BBEXbBmmFNMipY")

models = genai.list_models()

for m in models:
    print(m.name)