import pandas as pd

df = pd.read_csv("../people.csv")
for name in df["Name"]:
    print("rules_" + "".join(name.to_lower().split()) + ".md")
