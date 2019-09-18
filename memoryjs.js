
var cardID = 0;
var cards = 0;
var cWidth = 0;


var perc = 0;
var animInterval;
var closeAnimInterval;
var currentCard = "";
var currentCardOld = "";
var currentWidth;
var turnBack = false;
var animActive = false;

var timeVar = 0;
var openCardInt = 0;
var pair = false;

var imagePath;
var mode = 1;
var attempts;
var curAttempt = 0;
var curPlayer = 1;

var P1Score = 0;
var P2Score = 0;

var cheating = false;

var preloadNum = 1;
//setInterval(Cloud, 20);
var sav = setInterval(preload, 10);


	//Den här funktionen laddar in alla bilder som används för att inte
	//ha någon delay under matchen.
function preload() {
	var hidIMG = document.getElementById("hidden");
	hidIMG.src = "image/Card" + preloadNum + ".png";
	preloadNum++;

	if(preloadNum == 37){
		clearInterval(sav);
	}

}


	//Den här funktionen byter vilken svårighetsgrad som har valts.
	//Svårighetsgraden byter hur många kort som används.
function setDif(dif){
	mode += dif;
	if(mode <= 0){
		mode = 1;
	} else if (mode >= 5){
		mode = 4;
	}

	var MPDif = document.getElementById("MPDif");

	switch(mode){
		case 1:
			MPDif.src = "image/EasyButton.png";
			break;
		case 2:
			MPDif.src = "image/MediumButton.png";
			break;
		case 3:
			MPDif.src = "image/HardButton.png";
			break;
		case 4:
			MPDif.src = "image/InsaneButton.png"
			break;
	}
}

	//Sätter spelarnamnen till de namn som man skrivit i textfälten.
	//Om spelaren inte har valt hur många attempts så är standarden 1
function MPStart(){
	var P1Text= document.getElementById("LeftHUD").getElementsByTagName('p')[0];
	P1Text.innerHTML = document.getElementById("P1Name").value;

	var P2Text= document.getElementById("RightHUD").getElementsByTagName('p')[0];
	P2Text.innerHTML = document.getElementById("P2Name").value;

	attempts = Number(document.getElementById("Attempt").value);
	if(attempts == 0){
		attempts = 1;
	}

	CreateBoard();
}

	//Den här funktionen skapar alla memorykort (div), sätter en passande storlek på den
	//path till bilden sätts i 'name' attributet. Sedan skapas en <img> i alla divar som visar bilden.
function CreateBoard(){
	moveInterval = setInterval(MovePopup, 5);
	switch(mode){
		case 1: 
			cards = 18;
			break;

		case 2:
			cards = 32;
			break;

		case 3:
			cards = 50;
			break;
		case 4:
			cards = 72;
			break;
	}


		//I den här loopen skapas en ny div som får klassen "Card" och en id som har "C0" till "C (Cards-1)".
		//Sedan får den ett img element och ett name attribut med path till bilden.
	for (var i = 0; i <cards; i++) {
		var newDiv = document.createElement("div");
		newDiv.classList.add("Card");

		var newID = "C" + i;	
		newDiv.setAttribute("id", newID);
		newDiv.setAttribute("name", "image/Card" + (1 + i%(cards/2)) + ".png");


		var newImg = document.createElement("img");
		var newA =  document.createElement("a");
		newImg.setAttribute("src", "image/CardBackside.png");
		newImg.setAttribute('draggable', false);
		newA.setAttribute("onclick", 'Select(\"'+newID+'\")');


		if(mode == 1){
			cWidth = 12.2;
		}

		if(mode == 2){
			cWidth = 8.9;
		}

		if(mode == 3){
			cWidth = 6.95;
		}

		if(mode == 4) {
			cWidth = 5.6;
		}
			newDiv.style.width = cWidth + "vw";
			newDiv.style.height = cWidth + "vw";
			newImg.style.width = cWidth + "vw";

		newA.appendChild(newImg);
		newDiv.appendChild(newA);
		currentDiv = document.getElementById("GameBoard");

		currentDiv.appendChild(newDiv);


		cardID++;
	}

	var op = document.getElementById("OptionsPane");
	currentDiv.removeChild(op);
	perc = 0;
	imagePath = newImg.src;
	
	FlushCard();
}

	//Den här funktionen aktiveras när spelet startar. MasteryHUD är där man ser poängen för spelarna.
function MovePopup(){
	var popup = document.getElementById("MasteryHUD");

	var pos = -10 + 10*Number(perc)/100;


	popup.style.top = pos + "vw";

	if(perc >= 100){
		perc = 100;
		clearInterval(moveInterval);
	}
	perc++;
}

	//Den här funktionen blandar name attributen på samtliga divs
function FlushCard() {
	var cr1;
	var cr2;
	var tempSrc;
	
	for(var i = 0; i < 999; i++)
	{
		var t1 = Math.round(Math.random() * cards);
		var t2 = Math.round(Math.random() * cards);

		if(t1 != cards && t2 != cards)
		{
			cr1 = document.getElementById("C" + t1);
			cr2 = document.getElementById("C" + t2);

		tempSrc = cr1.getAttribute('name');
		cr1.setAttribute('name', cr2.getAttribute('name'));
		cr2.setAttribute('name', tempSrc);
		}

	}	


} 


	//När man väljer ett kort anropas den här funktionen.
	//variablen imagePath är baksidebilden. Man kan bara välja kort som har baksidan upp.
	//Om 2 kort är aktiva så anropas CheckPair();
function Select(id){

	
	if(animActive == false && id != currentCard){
		var checkIMG = document.getElementById(id).getElementsByTagName('img')[0];

		if(checkIMG.src == imagePath)
		{
			animActive = true;		
			openCardInt++;		
			currentCardOld = currentCard;
			currentCard = id;

			currentWidth = cWidth;
			turnBack = false;
			pair = false;

			if(openCardInt == 2)
			{
				CheckPair();
			} else if(cheating){
				CheatFindPair();
			}

			animInterval = setInterval(OpenAnimation, 1);			
		}
	
	}

}

	//Den här funktionen är för att animera en vändning av korten.
	//Bredden på img byts i 45 delar, 45 gånger för att gå från 100% till 0%.
	//Vid 0% byts bilden och så aktiveras turnBack och så ökar bredden igen.
function OpenAnimation() 
{
	var div = document.getElementById(currentCard);
	var img = div.getElementsByTagName('img')[0];


	if(currentWidth > 0 && !turnBack)
	{
		currentWidth -= cWidth/45;
		img.style.width = (currentWidth+"vw");
	} 
	else if (currentWidth < cWidth){
		turnBack = true;
		currentWidth += cWidth/45;
		img.style.width = (currentWidth+"vw");
		img.src = div.getAttribute('name');
	}
	

	if(turnBack && currentWidth >= cWidth){
		clearInterval(animInterval);
		img.style.width = cWidth + "vw";
		turnBack = false;
		animActive = false;

		if(openCardInt == 2 && !pair){
			animActive = true;
			closeAnimInterval = setInterval(CloseAnimtion, 1);
		}
	}
}

	//När de två valda korten inte är samma så vänds båda tillbaka samtidigt
	//När bredden är 0 byts bilden till baksidan av kortet och bredden ökar igen.
function CloseAnimtion(){
	var img1 = document.getElementById(currentCard).getElementsByTagName('img')[0];
	var img2 = document.getElementById(currentCardOld).getElementsByTagName('img')[0];

	timeVar += 1;
	if(timeVar >= 250){
		if(currentWidth > 0 && !turnBack){
			currentWidth -= cWidth/40;
		} 
		else if(currentWidth < cWidth){
			turnBack = true;
			currentWidth += cWidth/40;
			img1.src = "image/CardBackside.png";
			img2.src = "image/CardBackside.png";
		}

		if(turnBack && currentWidth >= cWidth){
			clearInterval(closeAnimInterval);
			currentWidth = cWidth;
			turnBack = false;
			animActive = false;
			openCardInt = 0;
			timeVar = 0;

			currentCard = "";
			currentCardOld = "";


			curAttempt++;
			if(curAttempt == attempts){
				curAttempt = 0;		
				NextTurn();
			}

		}

		img1.style.width = (currentWidth + "vw");
		img2.style.width = (currentWidth + "vw");		
	}
}

	//Funktionen jämför name på de två aktiva korten och ger poäng ifall det är samma.
function CheckPair()
{
	var div1Src = document.getElementById(currentCard).getAttribute('name');
	var div2Src = document.getElementById(currentCardOld).getAttribute('name');

	if(div1Src == div2Src){
		pair = true;
		openCardInt = 0;

		if(curPlayer == 1)
		{
			P1Score++;
			document.getElementById("LeftHUD").getElementsByTagName('p')[1].innerHTML = "SCORE: " + P1Score;

		} else if (curPlayer == 2){
			P2Score++;
			document.getElementById("RightHUD").getElementsByTagName('p')[1].innerHTML = "SCORE: " + P2Score;
		}
	}


}

	//Byter UI så att man ser vilken spelare som är aktiv
function NextTurn()
{
	var P1Div = document.getElementById("LeftHUD");
	var P2Div = document.getElementById("RightHUD");

	if(curPlayer == 1)
	{
		curPlayer = 2;
		P1Div.style.backgroundImage = "url(image/HUD.png)";
		P2Div.style.backgroundImage = "url(image/HUDTurn.png)"
	} else {
		curPlayer = 1;
		P2Div.style.backgroundImage = "url(image/HUD.png)";
		P1Div.style.backgroundImage = "url(image/HUDTurn.png)"
	}
}

	//Funktionen aktiverar eller diseblerar fusk funktionen när SHIFT trycks
function Cheatmode(event)
{
	var key = event.which || event.keyCode;

	if(key == 16)
	{
		cheating = !cheating;

		if(cheating && cards != 0){
			CheatFindPair();
		} else {
			document.getElementById("Cheat").innerHTML = "";
		}
	}
}

	//Den här funktionen letar efter det kort som har samma name som det som redan är öppet
	//Och skriver sedan vilken koordinate den är på i spelplanet.
function CheatFindPair()
{
	document.getElementById("Cheat").innerHTML = "C";

	var imgName = document.getElementById(currentCard).getAttribute('name');

	for(var i = 0; i < cards; i++)
	{
		if("C" + i != currentCard)
		{
			if(imgName == document.getElementById("C" + i).getAttribute('name'))
			{
				switch(cards){
					case 18:
						document.getElementById("Cheat").innerHTML = (i%6 +1) +  ", " + (Math.floor(i/6) + 1);
						break;

					case 32:
						document.getElementById("Cheat").innerHTML = (i%8 +1) +  ", " + (Math.floor(i/8) + 1);
						break;

					case 50:
						document.getElementById("Cheat").innerHTML = (i%10 +1) +  ", " + (Math.floor(i/10) + 1);
						break;
					case 72:
						document.getElementById("Cheat").innerHTML = (i%12 +1) +  ", " + (Math.floor(i/12) + 1);
				}
			}
		}
	}
}
