# Casino-Promotion-Core-System

D დისკზე შექმენით data ფოლდერი, სადაც ჩაამატებთ transactions.txt ფაილს, რომელშიც იქნება ბრძანებები და პარამეტრები.  
ტერმინალში შეიყვანეთ:  
docker build -t casino-app  
docker run -v D:/data:/data casino-app
მაკ-ოესის შემთხვევაში:
docker run -v ~Desktop/data:/data casino-app
