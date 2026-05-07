def categorize(description: str):
    text = description.lower()

    if "rewe" in text or "lidl" in text:
        return "Groceries"
    elif "netflix" in text or "spotify" in text:
        return "Entertainment"
    elif "uber" in text:
        return "Transport"
    else:
        return "Other"