
let box=document.querySelector(".grid");        //box holding the grid

let editbtn=document.querySelector(".edit");    //button elements
let clrbtn=document.querySelector(".clear");    
let hintbtn=document.querySelector(".hint");
let slvbtn=document.querySelector(".solve");    

editbtn.addEventListener("mousedown", edit);    //adding EventListeners
clrbtn.addEventListener("mousedown", clear);
hintbtn.addEventListener("mousedown",hint);   
slvbtn.addEventListener("mousedown", solve);
box.addEventListener("mousemove", track);
window.addEventListener("keydown", input);
    
let editing=false;                              //flag for editing mode
let mousex=0;                                   //current mouse position
let mousey=0;
let numbers=initialize();                       //numbers is a 9x9 array of divs, each div contains the number on the grid.
testcase();                                     //adds the test case to numbers
let grid=getgrid();                             //grid is a 9x9 array of numbers, 0 is blank, 1-9 are numbers.


function edit()                                                         //button links here to toggle edit flag
{
    editing=!editing;
}

function solve()                                                        //button links here, runs solution and prints grid to the screen
{
    if(!solution())
    {
        g=getgrid();
        window.confirm("No Solution");
        return false;
    }
    fillscreen();
    return true;
}

function hint()                                                         //button links here, solves the grid and fills out one spot on the grid. 
{
    if(empty()[0]==-1)          //puzzle is done
        return false;

    if(!solution())             //no possible solution
    {
        grid=getgrid();
        window.confirm("No Solution");
        return false;
    }
    let empties=emptyspots();   //get list of empty spots, fill in a random empty spot with grid, then set grid back to screen
    let spot = empties[parseInt(Math.random()*empties.length)];
    numbers[spot[0]][spot[1]].innerHTML=grid[spot[0]][spot[1]];
    grid=getgrid();
    fillscreen();
}

function emptyspots()                                                   //returns a list of blank spots on the screen
{
    let temp=[];
    for(let i =0; i<9; i++)
        for(let j =0; j<9; j++)
            if(numbers[i][j].innerHTML=="")
                temp.push([i,j]);
    return temp;
}

function empty()                                                        //returns the first empty spot on the grid
{
    for(let i =0; i<9; i++)
        for(let j=0; j<9; j++)
            if(grid[i][j]==0)
                return [i,j];
    return [-1,-1];
}

function solution()                                                     //finds the solution to the grid recursively
{
    let p=empty();
    if(p[0]==-1)
        return true;
    for(let i=9; i>=1; i--)
    {
        grid[p[0]][p[1]]=i;
        if(possible(i, p) && solution())
            return true;
        else
            grid[p[0]][p[1]]=0;
    }
    return false;
}

function testcase()                                                     //adds a base test case to the grid on load
{
    numbers[0][0].innerHTML=8;
    numbers[2][1].innerHTML=3;
    numbers[1][2].innerHTML=7;
    //numbers[0][1].innerHTML=9;
    //numbers[0][2].innerHTML=6;
    numbers[3][1].innerHTML=6;
    numbers[4][2].innerHTML=9;
    numbers[6][2].innerHTML=2;
    numbers[1][3].innerHTML=5;
    numbers[5][3].innerHTML=7;
    numbers[4][4].innerHTML=4;
    numbers[5][4].innerHTML=5;
    numbers[3][5].innerHTML=1;
    numbers[6][4].innerHTML=7;
    numbers[7][5].innerHTML=3;
    numbers[2][6].innerHTML=1;
    numbers[2][7].innerHTML=8;
    numbers[1][8].innerHTML=9;
    numbers[3][7].innerHTML=5;
    numbers[7][6].innerHTML=6;
    numbers[8][6].innerHTML=8;
    numbers[7][7].innerHTML=1;
    numbers[6][8].innerHTML=4;
}

function fillscreen()                                                   //puts grid g on the screen
{
    for(let i=0; i<9; i++)
        for(let j=0; j<9; j++)
            if(grid[i][j]!=0)
                    numbers[i][j].innerHTML=grid[i][j];
}

function getgrid()                                                      //gets the current grid on the screen, with 0 replacing blank spots
{
    let g=[];
    for(let i=0; i<9; i++)
    {
        let temp=[];
        for(let j=0; j<9; j++)
        {
            let n=parseInt(numbers[i][j].innerHTML);
            if(isNaN(n))
                n=0;
            temp.push(n);
        }
        g.push(temp);
    }
    return g;
}

function clear()                                                        //button links here, clears the screen
{
    for(let i =0; i<9; i++)
    {
        for(let j=0; j<9; j++)
        {
            grid[i][j]=0;
            numbers[i][j].innerHTML="";
            numbers[i][j].style.backgroundColor="white";
        }
    }
}

function possible(num, position)                                        //takes in a num, an x/y position, and checks if the num can be placed in the position in grid
{
    let temp=grid[position[0]][position[1]];
    grid[position[0]][position[1]]=0;

    for(let i =0; i<9; i++)                                             //checks the rows and columns at that position for that number.
        if(grid[i][position[1]]==num||grid[position[0]][i]==num)
        {
            grid[position[0]][position[1]]=temp;
            return false;
        }
    let xbound=parseInt(position[0]/3)*3;
    let ybound=parseInt(position[1]/3)*3;
    
    for(let i =xbound; i<xbound+3; i++)                                 //checks the 3x3 box for the same number, 
        for(let j=ybound; j<ybound+3; j++)
            if(grid[i][j]==num)
            {
                grid[position[0]][position[1]]=temp;
                return false;
            }
        grid[position[0]][position[1]]=temp;
    return true;
}

function input(e)                                                       //enters numbers onto the grid at current mousepos on keyboard input
{
    let x=parseInt(mousex/100);
    let y=parseInt(mousey/100);
    let currentbox=numbers[x][y];
    
    if(editing)
    {
        currentbox.innerHTML="";
        grid[x][y]=0;
        return;
    }

    let key=Number(e.key);
    if(isNaN(key)||e.key===null||e.key===' ')
        return;

    if(possible(key, [x, y]))
    {
        currentbox.innerHTML=key;
        grid[x][y]=key;
        fillscreen();
        flash(currentbox, "lightgreen");
    }
    else
    {
        flash(currentbox, "red");
    }
}

function flash(b, color)                                                //flashes if invalid input is detected
{
    b.style.backgroundColor=color;
    setTimeout(function(){b.style.backgroundColor="white";}, 200);
}

function initialize()                                                   //draws the 9x9 box by filling it with 81 divs
{
    let nums=[];
    for(let i=0; i<9; i++)
    {
        let temp=[];
        for(let j=0; j<9; j++)
        {
            let x = i*100;
            let y = j*100;
            let sq=document.createElement("div");
            sq.className="box";
            sq.style.left=x+"px";
            sq.style.top=y+"px";
            sq.style.borderStyle="solid";
            sq.style.borderWidth="1px";

            if(i==0)
            {
                sq.style.borderLeftWidth="6px";
                sq.style.width="93px";
            }
            if(i==2)
            {
                sq.style.borderRightWidth="3px";
                sq.style.width="96px";
            }
            if(i==3)
            {
                sq.style.borderLeftWidth="3px";
                sq.style.width="96px";
            }
            if(i==5)
            {
                sq.style.borderRightWidth="3px";
                sq.style.width="96px";
            }
            if(i==6)
            {
                sq.style.borderLeftWidth="3px";
                sq.style.width="96px";
            }
            if(i==8)
            {
                sq.style.borderRightWidth="6px";
                sq.style.width="93px";
            }
            if(j==0)
            {
                sq.style.borderTopWidth="6px";
                sq.style.height="93px";
            }
            if(j==2)
            {
                sq.style.borderBottomWidth="3px";
                sq.style.height="96px";
            }
            if(j==3)
            {
                sq.style.borderTopWidth="3px";
                sq.style.height="96px";
            }
            if(j==5)
            {
                sq.style.borderBottomWidth="3px";
                sq.style.height="96px";
            }
            if(j==6)
            {
                sq.style.borderTopWidth="3px";
                sq.style.height="96px";
            }
            if(j==8)
            {
                sq.style.borderBottomWidth="6px";
                sq.style.height="93px";
            }
            box.appendChild(sq);
            temp.push(sq);
        }
        nums.push(temp);
    }
    return nums;
}

function track(e)                                                       //tracks mouse position
{
    mousex=e.clientX-box.getBoundingClientRect().left;
    mousey=e.clientY-box.getBoundingClientRect().top;
}
