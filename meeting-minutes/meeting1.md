**_First Formal Meeting (31/10)_**
**Charlie:**
We need to ask for a specification, and figure out how we’re going to parse the data. We should speak to the client about how he wants the database, so he can guide us if that’s what he wants.
The data we think we want: The name of the child, name of both parents, bank account number. Do we keep a record on the scouts who have not yet paid? We can add a field to the spreadsheet for it. Is he going to check the dates for when the money comes in? We should keep a value of the money owed, independent of the dates.
How do they want to interact with the database? As a program, or as a Web App? How tech-savvy are the people who are using it? We need options to download the Excel spreadsheet, where they can edit it manually.
**Tom P:**
What OS is our client on, and how is he going to access the program?
**Tom W:**
I’m going to start a new draft on the database structure. Checking the dates might be redundant, because the bank does things on an automatic basis (Standing Order).
**Sara:**
Security should not be too much of an issue, since storing it locally is the same as storing it on the cloud, essentially.
**Lee:**
We should not offer this as a Web App, because of security issues. He might not want a web application at all.
