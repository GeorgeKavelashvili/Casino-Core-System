# Casino-Promotion-Core-System

D დისკზე შექმენით data ფოლდერი, სადაც ჩაამატებთ transactions.txt ფაილს, რომელშიც იქნება ბრძანებები და პარამეტრები:register user1
register user2
addscenario 1000 1500 2000
addscenario 3000 3500 4000
addscenario 5000 5500 6000
deposit user1 100
bet user1 Slots 10
bet user1 Slots 15
bet user1 Slots 20
bet user1 Slots 5
bet user1 CASINO 10
deposit user2 100
bet user2 Slots 100
balance user1
balance user2


ტერმინალში შეიყვანეთ:  
docker build -t casino-app  
docker run -v D:/data:/data casino-app
მაკ-ოესის შემთხვევაში:
docker run -v ~Desktop/data:/data casino-app
