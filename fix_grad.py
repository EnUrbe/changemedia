import re

with open("src/components/admin/GradPageForm.tsx", "r") as f:
    content = f.read()

# Instead of rewriting everything manually, I will parse the file and inject an array editor for Packages and Addons.
# Actually, I can just write a script that generates a React component that recursively handles packages and addons.
