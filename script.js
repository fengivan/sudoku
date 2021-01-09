
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
let certain=[];                                 //certain is an array of numbers we have so far that are certain, used with hint function

for(let i =0 ;i<9; i++)                         //sets current filled out positions to certain
{
    let temp=[];
    for(let j =0; j<9; j++)
    {
        temp.push(grid[i][j]!=0);
    }
    certain.push(temp);
}

let posval=getposval();                         //gets the list of possible values at each position
fillscreen();                                   //fills the screen with grid

function edit()                                                         //button links here to toggle edit flag
{
    editing=!editing;
}

function solve()                                                        //button links here, runs solution and prints grid to the screen
{
    solution();
    if(!solved())
    {
        window.confirm("No solution");
        return false;
    }
    fillscreen();
    return true;
}

function hint()                                                         //button links here, solves the grid and fills out one spot on the grid. 
{
    let temp=emptyspots();  
    solution();             //gets the solution, then takes it off the grid.
    if(!solved())
        {
            window.confirm("No solution");
            badpuzzle=true;
            return;
        }

    let showspot = temp[parseInt(Math.random()*temp.length)];       //random spot that will be shown
    certain[showspot[0]][showspot[1]]=true;

    for(i=0; i<9; i++)
        for(j=0; j<9; j++)
            if(!certain[i][j])
                grid[i][j]=0;

    fillscreen();
    posval=getposval();
}

function emptyspots()                                                   //returns an array of the empty spots on the grid
{
    let temp=[];
    for(let i=0; i<9; i++)
        for(let j =0; j<9; j++)
            if(grid[i][j]==0)
                temp.push([i,j]);
    return temp;
}

function testcase()                                                     //adds a base test case to the grid on load
{
    numbers[2][0].innerHTML=4;
    numbers[1][1].innerHTML=8;
    //numbers[2][2].innerHTML=1;
    numbers[0][3].innerHTML=3;
    //numbers[1][4].innerHTML=5;
    numbers[2][5].innerHTML=8;
    numbers[0][8].innerHTML=4;
    numbers[1][7].innerHTML=9;
    numbers[1][6].innerHTML=2;
    numbers[3][0].innerHTML=8;
    //numbers[3][1].innerHTML=1;
    numbers[3][2].innerHTML=3;
    //numbers[4][0].innerHTML=6;
    //numbers[4][1].innerHTML=7;
    //numbers[4][2].innerHTML=2;
    //numbers[5][2].innerHTML=9;
    //numbers[3][3].innerHTML=5;
    //numbers[3][6].innerHTML=6;
    //numbers[4][3].innerHTML=4;
    numbers[4][5].innerHTML=3;
    numbers[5][5].innerHTML=1;
    //numbers[4][6].innerHTML=9;
    //numbers[4][7].innerHTML=5;
    //numbers[4][8].innerHTML=1;
    //numbers[5][6].innerHTML=7;
    //numbers[5][7].innerHTML=8;
    numbers[5][8].innerHTML=3;
    numbers[8][0].innerHTML=1;
    numbers[7][1].innerHTML=3;
    //numbers[7][2].innerHTML=5;
    numbers[6][3].innerHTML=9;
    numbers[7][4].innerHTML=4;
    //numbers[8][5].innerHTML=7;
    numbers[6][6].innerHTML=3;
    //numbers[7][7].innerHTML=2;
    numbers[6][8].innerHTML=8;
}

function getposval()                                                    //returns a 9x9 grid of arrays. Each array contains the possible values at that position 
{
    let p=[];
    for(let i =0; i<9; i++)
    {
        p.push([]);
        for(let j=0; j<9; j++)
        {
            p[i].push([]);
            if(grid[i][j]==0)
            {
                let list=[];
                for(let k=1; k<=9; k++)
                {
                    if(possible(k, [i,j]))
                        list.push(k);
                }
                    p[i][j]=list;
            }
        }
    }
    return p;
}

function solution()                                                     //attempts to find a solution to grid, with logic first then brute force
{
    logic();
    if(solved())
        return;

    let empty=emptyspots();                                         //list of empty spots
    let curposval=[];                                               //index of possible values we're trying, start at the frist possible value for each empty spot.
    for(let i=0; i<empty.length; i++)
        curposval.push(0);
    
    let i =0;                                                       //index of empty spots
    let stopper=0;                                                  //loop breaker
    console.log(empty);
    while(i>=0 && i<empty.length&&stopper<5000)
    {
        stopper++;
        let temp=getposvals(empty[i][0], empty[i][1]);              //gets a list of possible vals at this spot
    
        if(curposval[i]>=temp.length)
        {
            grid[empty[i][0]][empty[i][1]]=0;
            curposval[i]=0;
            i--;;
            continue;
        }
       
        grid[empty[i][0]][empty[i][1]]=temp[curposval[i]];          //grid at first empty spot is equal to possible val at that empty spot at 0;
        curposval[i]++;
        posval=getposval();
       
        for(let a=i+1; a<empty.length; a++)                         //looks at all the remaining empty spots, checks to see if any have no possible numbers (if so the something's wrong)
        {
            if(getposvals(empty[a][0], empty[a][1]).length==0)
            {
                if(curposval[i]<temp.length)                        //still more untried possibilities at this position
                {
                    grid[empty[i][0]][empty[i][1]]=temp[curposval[i]];  
                    curposval[i]++;
                    a=i+1;                                          //go back to the start of the list
                }
                else                                                //this spot has ran out of possibilities, go back to the previous index and try the next possible value
                {
                    grid[empty[i][0]][empty[i][1]]=0;
                    curposval[i]=0;
                    i-=2;
                    a=100;
                }
            }
        }
        i++;
    } 
    return;
}

function getposvals(i,j)                                                //returns an array of possible values at position i, j
{
    let temp=[];
    for(let a=1; a<=9; a++)
        if(possible(a, [i,j]))
            temp.push(a);
    return temp;
}

function solved()                                                       //checks if grid is filled out or not
{
    for(let i=0; i<9; i++)
        for(let j=0; j<9; j++)
            if(grid[i][j]==0)
                return false;
    return true;
}

function logic()                                                        //combines the logic of all 3 methods and runs them until nothing happens
{
    while(method1()||method2()||method3())
            continue;
        
}

function updateposval(i, j, val)                                        //if val has been inserted at i, j, update posval to remove val from column i and row j, and box i-j
{
    posval[i][j]=[];
    for(let a=0; a<9; a++)
    {
        let temp=[];
        for(let z=0; z<posval[i][a].length; z++)
            if(posval[i][a][z]==val)
                posval[i][a].splice(z, 1);

        for(let z=0; z<posval[a][j].length; z++)        
            if(posval[a][j][z]==val)
                posval[a][j].splice(z,1);
    }

    let xbound=parseInt(i/3)*3;
    let ybound=parseInt(j/3)*3;

    for(let a=xbound; a<xbound+3; a++)
        for(let b=ybound; b<ybound+3; b++)
            for(let c=0; c<posval[a][b].length; c++)
                if(posval[a][b][c]==val)
                        posval[a][b].splice(c,1);
}

function method1()                                                      //basic logic, if there's only 1 number that can go in a spot, fill that spot with the number.
{
    let change=false;
    for(let i =0; i<9; i++)             
    {
        for(let j=0; j<9; j++)
        {
            if(posval[i][j].length==1)
                {
                    grid[i][j]=posval[i][j];
                    
                    updateposval(i, j, grid[i][j]);
                    change=true;
                }
        }
    }
    return change;
}

function method2()                                                      //row and logic, if there's only 1 spot for a number in that row/column, it goes in that spot.
{
    let change=false;
    for(let i =0; i<9; i++)                                         
    {
        for(let j=1; j<=9; j++)
        {
                let temp=[];
                let temp2=[]
                for(let k=0; k<9; k++)
                {
                    if(posval[i][k].includes(j)&&(grid[i][k]==0))
                        temp.push(k);
                    if(posval[k][i].includes(j)&&(grid[k][i]==0))
                        temp2.push(k);
                }

                if(temp.length==1)
                {
                    grid[i][temp[0]]=j;
                    updateposval(i, temp[0], j);
                    change=true;
                }
                if(temp2.length==1)
                {
                    grid[temp2[0]][i]=j;
                    updateposval(temp2[0], i, j);
                    change=true;
                }
        }
    }
    return change
}

function method3()                                                      //3x3 box logic, if there's only 1 spot for a number in a box, set that spot to that number.
{
    let change=false;
    for(let i=0; i<3; i++)                                              
    {
        for(let j=0; j<3; j++)
        {
            for(let k=1; k<9; k++)
            {
                let temp=[]
                for(let ii=0; ii<3; ii++)
                {
                    for(let jj=0; jj<3; jj++)
                    {
                        if(posval[3*i+ii][3*j+jj].includes(k)&&grid[3*i+ii][3*j+jj]==0)
                            {
                                temp.push(ii);
                                temp.push(jj);
                            }
                    }
                }
                if(temp.length==2)
                {
                    grid[3*i+temp[0]][3*j+temp[1]]=k;
                    updateposval(3*i+temp[0],3*j+temp[1], k);
                    change=true;
                }   
            }
        }
    }
    return change;
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
            certain[i][j]=false;
            numbers[i][j].innerHTML="";
            numbers[i][j].style.backgroundColor="white";
        }
    }
    posval=getposval();
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
        certain[x][y]=false;
        posval=getposval();
        return;
    }

    let key=Number(e.key);
    if(isNaN(key)||e.key===null||e.key===' ')
        return;

    if(posval[x][y].includes(key))
    {
        currentbox.innerHTML=key;
        grid[x][y]=key;
        updateposval(x,y,key);
        certain[x][y]=true;
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
