import pandas as pd

df = pd.read_csv("./people.csv")
print(df)
for email in df["Email"]:
    print(email)
