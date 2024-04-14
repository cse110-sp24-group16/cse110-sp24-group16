import pandas as pd

df = pd.read_csv("../people.csv")
for name in df["Name"]:
    print("cp rules.pdf rules_" + "".join(name.lower().split()) + ".pdf")
