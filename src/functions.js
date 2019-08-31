const N = 8;
var matrixTab = Array();
var dx = [1,2,2,1,-1,-2,-2,-1];
var dy = [2,1,-1,-2,-2,-1,1,2];
var color = "#836953";
let selectedSource = false;		
let xSource,ySource,xDestiny,yDestiny;

function loadBoard(){
    //Criando tabuleiro
	for(let i = 0;i < 8;i++){
		let row = table.insertRow(i);
		matrixTab[i] = Array(); 
		for(let j = 0;j < 8;j++){
	 		matrixTab[i][j] = row.insertCell(j);
	        $('td').eq(i*N+j).append('<div class="imgBG"></div>');	
	      	$('div').eq(i*N+j).hide();//Oculta img 
	        if((j+i)%2 == 0) matrixTab[i][j].style.backgroundColor = color;
		}
	}
}
		
function transitionAnimanton(xS,yS,xD,yD){
    let cell;
    let colorPrev = matrixTab[xD][yD].style.backgroundColor;
         
    //Marcando posições possíveis
    for(let k = 0;k < 8;k++){
        if((xS + dx[k] < N)&&(xS + dx[k] >= 0)&&(yS + dy[k] < N)&&(yS + dy[k] >= 0)){
    		cell = $('td').eq((xS + dx[k])*8+(yS + dy[k]));
    		cell.animate({"background-color": "rgba(255,255,0,0.8)"}, 1500);
        }
    }
    
    //Marcando melhor posição
	$('td').eq(xD*N+yD).animate({"background-color": "rgba(255,0,0,0.8)"}, 250);

    //Movendo cavalo
    setTimeout(function(){
        $('div').eq(xS*N+yS).fadeOut(2000);      
		$('div').eq(xD*N+yD).fadeIn(2000);	
	},1800);
			
    //Desmarcando posições possíveis
   	setTimeout(function(){
	    for(let k = 0;k < 8;k++){
	        if((xS + dx[k] < N)&&(xS + dx[k] >= 0)&&(yS + dy[k] < N)&&(yS + dy[k] >= 0)){
	    		cell = $('td').eq((xS + dx[k])*8+(yS + dy[k]));
	    		cell.animate({"background-color": colorPrev},1500);
	        }
	    }
 	},3000);

}

function animationSetup(){
	//Seleção de posição
	let colorPrev;
	$('td').hover(
		function() {
			colorPrev = this.style.backgroundColor;
		    $(this).animate({"background-color": "yellow"}, 50);
		}, 
		function() {
		   	$(this).animate({"background-color": colorPrev}, 0);
		}
	);

	$('td').click(function() {
		let coordx = $(this).parent();//linha obj
		let coordy = $(this);//coluna obj
		console.log(coordx.index()); 
		console.log(coordy.index());
		//Seleção da origem / destino
		if(!selectedSource){
		  	coordy.css("border", "4px solid blue");
		  	xSource = coordx.index();
		  	ySource = coordy.index();
		  	selectedSource = true;	
		}
		else{
			coordy.css("border", "4px solid red");
		  	xDestiny = coordx.index();
		  	yDestiny = coordy.index();
		  	selectedSource = false;	
		}  		
	});

	//$("td").off( "mouseenter mouseleave" );
	//$("td").off( "click" );
}

function submitPositions(){
	window.location.href = 'exe_page.html' + '?' + xSource + '&' + ySource + '&' + xDestiny + '&' + yDestiny;
}

function getPositions(){
	let positions = window.location.search;	
	positions = positions.replace('?','');
	positions = positions.split('&');
	xSource = parseInt(positions[0]);
	ySource = parseInt(positions[1]);
	xDestiny = parseInt(positions[2]);
	yDestiny = parseInt(positions[3]);
	matrixTab[xSource][ySource].style.border = '4px solid blue';
	matrixTab[xDestiny][yDestiny].style.border = '4px solid red';
	console.log(positions);
}

function searchShortestWay(xSource,ySource,xDestiny,yDestiny){
	let coords,tmp,i,j;
	let find = false;
	let states = new Map();
	let to_visit = Array();
    let solution = Array();

    to_visit.push(`{"x":${xSource},"y":${ySource}}`);
    while(!find){
    	coords = JSON.parse(to_visit[0]);
    	i = coords.x;
        j = coords.y;
			
		for(let k = 0;k < 8;k++){
            if((i + dx[k] < N)&&(i + dx[k] >= 0)&&(j + dy[k] < N)&&(j + dy[k] >= 0)){
                tmp = `{"x":${i + dx[k]},"y":${j + dy[k]}}`;
                if(!states.has(tmp)){                   
                    to_visit.push(tmp);                        
                    states.set(tmp,to_visit[0]);
                    if((i + dx[k] == xDestiny)&&(j + dy[k] == yDestiny)){ find = true; break; }
                }
            }
        }
        to_visit.shift();
    }

	console.log("Size: " + states.size);

   	tmp = `{"x":${xDestiny},"y":${yDestiny}}`
    solution.push(tmp);
    while(tmp != `{"x":${xSource},"y":${ySource}}`){
    	solution.push(states.get(tmp));
		tmp = states.get(tmp);
    }

    solution.pop();
    solution.reverse();
    solution.forEach(function(value){
    	console.log(value);
    });
 	
 	return [solution,states.size];   
}