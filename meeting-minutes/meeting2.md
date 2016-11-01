**_First Client Meeting_**

**John:**
We get a bank statement from Lloyds, in the form of a CSV, but only 150 records at a time, even though we have more than 150 paying by Standing Order (SO) each month (around 220). We get other incomes, and other standing orders that are irrelevant to our needs. The standard subscription is 14 Pounds per child, but if they have a sibling then the sibling only pays 9 Pounds. Some parents will pay the 9 Pounds separately, but some will pay them jointly. Some may have more tha one sibling, so the numbers are never uniform. The children's names are saved in a large spreadsheet, but this spreadsheet contains some members who are resigned; the resigned ones will have their own codes. There is no easy match between the bank accounts and the scouts, so we might need a manual feature to allow us to match the bank account to the scout for those who have incomplete information. It would be best for it to run on a website.

The current system takes a CSV file that matches the information and gives you an option to make a manual match to make changes to any information that is incorrect. The system should save options for autocompletion in the future. The Scouts' information is stored online. We need to keep legacy data on screen for gift aid reasons, so we need it available for at least 12 months (preferably it would be hidden for anything beyond the last 12 months).

The Scouts are expected to pay on the first of the month, but in practice, they pay at any time within the month. So, we check the statement for the sub fees for the last month. Any child that hasn't paid will have their names highlighted in red when the database shows up; it has to be checked manually if a child has been flagged. Clicking on the name of the child brings up an e-mail with a template that makes it easier for me to send them an e-mail to chase them. Some children pay by cash on the day of the night itself, and this information is not well-documented, so it would be good if we could enter this into the database.

The section leaders will log into the website and record any cash that has been handed in on the night.

We need to be able to tell the months in which the Scouts have not paid.

First week is free, then every subsequent week is 5 quid, until they've set up their SO. It's not worth the hassle starting an accruals system. *The thing that I'm most concerned about is being able to spot a child who has not paid at all*. If you could do it on a family basis, that would be good, because then I'll be able to track if  a child starts, and their sibling leaves, meaning the SO doesn't change.

So we need a manual checking system, on top of an automatic system. The more automatic, the better, because we have high turnover.

I can give you access to the website, at some point, but it has live data on it right now. I'll give you a copy of the Excel spreadsheet that I have now. At the moment, it's a PHP-driven website with a MySQL database.

The codes represent the days that the Scouts attend the meeting:
X = The Scouts have left

Some children have bank reference numbers that change every month. The names will come in, along with transaction date and time, as well as the transaction description. Each Scout has a Unique ID but we cannot request them to include it in the transaction references.

Do note that, when you upload the CSV file from the bank, you might get overlapping records. I check each row, just in case there's an update in the transactions coming in, such as the order, etc.

**Tom W:**
So we should be able to link the children up by their last names, to identify if they are in the same family.