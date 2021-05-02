    class CalcController{


constructor(){
    //THIS ESTA CONSTRUINDO UM OBJETO
             this._audio = new Audio('click.mp3');
             this._audioOnOff = false;
            this._lastOperator = '';
            this._lastNumber = '';
            this._operation = [];
            this._locale = 'pt-br';
            this._displayCalcEl = document.querySelector('#display');//BUSCANDO O ID display DO DOCUMENTO HTML E O THIS ESTA TRANSFORMANDO O ID EM OBJETO
            this._dateEl = document.querySelector('#data');//BUSCANDO O ID  data DO DOCUMENTO HTML E O THIS ESTA TRANSFORMANDO O ID EM OBJETO
            this._timeE1 =  document.querySelector('#hora');//BUSCANDO O ID  hora DO DOCUMENTO HTML  E O THIS ESTA TRANSFORMANDO O ID EM OBJETO
            this._currentDate;
            this.initialize();
            this.initButtonsEvents();
            this.initKeyboard();
         
        }

        //COPIAR E COLAR CTRL C E CTRL V

        pasteFromClipboard(){//COPIAR DA AREA DE TRAFERENCIA
            document.addEventListener('paste', e=>{
              let text =  e.clipboardData.getData('Text')

              this.displayCalc = parseFloat(text);
                
            })
        } 
        copyToClipboard(){
            let input = document.createElement('input');

            input.value = this.displayCalc;
            document.body.appendChild(input)

            input.select();

            document.execCommand("Copy")

            input.remove();//REMOVER O INPUT 
        }


        initialize(){
 
            this.setDisplayDateTime();
     
           setInterval(()=>{
     
            this.setDisplayDateTime();
     
           }, 1000);
     
           this.setLastNumberToDisplay();
           this.pasteFromClipboard();

           //EVENTO DE SOM 
     
           document.querySelectorAll('.btn-ac').forEach(btn=>{
        
            btn.addEventListener('dblclick',  e=>{
     
                this.toggleAudio();
     
     
            });
     
           });
        }
     
        
    toggleAudio(){
 
        this._audioOnOff = !this._audioOnOff;
 
       
    }
        playAudio(){
 
    
    
            if (this._audioOnOff){
     
                this._audio.currentTime = 0;
                this._audio.play();            
            }
     
            
        }

        //EVENTOS COM  AS TECLAS

        initKeyboard(){
            document.addEventListener('keyup', e =>{
        
                this.playAudio();

                switch(e.key){
                    case 'Escape':
                        this.cleanAll();
                        break;
                    case 'Backspace':
                        this.cleanEntry();
                        break; 
                        
                        
                    case '+':
                        if(e.altKey) ;

                    case '-':
                    case '*':
                    case '/':
                    case '%': 
                        this.addOperation(e.key)
                        break;
                 
                    case 'Enter':
                    case '=':
                        this.calc();
                        break;
                    case '.':
                    case ',':
                        this.addDot('')
    
                       break;
    
                        case '0':
    
                        case '1':
    
                        case '2':
    
                        case '3':
    
                        case '4':
    
                        case '5':
    
                        case '6':
    
                        case '7':
    
                        case '8':
    
                        case '9':
    
                        this.addOperation(parseInt(e.key));
                            break;
     
                    case 'c':
                        if(e.ctrlKey) this.copyToClipboard();
                        break
                  
                }
            })
        }

        addEventListenerAll(element,event, fn){

            event.split(' ').forEach(event =>{

                element.addEventListener(event, fn, false/*para nao aconteceter 2 clicks*/);

            });

        }
cleanAll(){
    this._operation = [];
    this.lastNumber = '';
    this._lastOperator = '';
    this.setLastNumberToDisplay();


}

cleanEntry(){
    this.setLastNumberToDisplay();
    this._operation.pop( );
    //ELIMINA O ULTIMO ELEMENTO DO ARRAY 
    
}

getLastOparation(){

     return this._operation[this._operation.length -1];

}

setLastOperator(value){
    this._operation[this._operation.length -1 ] = value
}

isOperator(value){
 return(['+', '-', '*', '%', '/',].indexOf(value) > -1 )
}

pushOperator(value){
    
    this._operation.push(value)

    if(this._operation.length > 3){

        this.calc();
       
    }
     
 
}

getResult(){

    try{//TENTA
    return eval(this._operation.join(""))
}  catch(e){//se o try nao consegui
    setTimeout (()=>{
        this.setError()
    }, 1 );

}
}
    calc(){
 
        let last='';
        this._lastOperator = this.getLastItem();
        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }
            if ( this._operation.length > 3){
             last = this._operation.pop() //retire o ultimo o 4 elemento guardo na variavel pop()
     
            this._lastNumber =  this.getResult();

        }else if(this._operation.length ==3){
            this._lastNumber = this.getLastItem(false)
        }     

        let result = this.getResult(); 
                

    if (last == "%" ){

        result /= 100;

        this._operation= [result];
    }else{
        this._operation = [result];

        if(last) this._operation.push(last);
    }   


    this.setLastNumberToDisplay();
}

getLastItem(isOperator = true){
    let lastItem;
    
    for(let i = this._operation.length - 1; i >= 0; i--){
        if(this.isOperator(this._operation[i]) == isOperator){
            lastItem = this._operation[i];

            break;
        }
    }
if(!lastItem){
    lastItem =(isOperator) ? this._lastOperator : this._lastNumber;
}
    return lastItem;

}

setLastNumberToDisplay(){
    let lastNumber = this.getLastItem(false);
 if(!lastNumber) lastNumber = 0
    this.displayCalc = lastNumber;
}

    addOperation(value){

        if (isNaN(this.getLastOparation())){//SE O ULTIMO NUMERO NAO FOR NUMERICO
            //String
            if(this.isOperator(value)){
                //TROCAR OPERADOR
                this._operation[this._operation.length -1] = value
            }else{
                this.pushOperator(value)
                this.setLastNumberToDisplay();
            }

        }else{

            if(this.isOperator(value)){
                this.pushOperator(value)
            }else{
                  //Number   
            let newValue = this.getLastOparation().toString() + value.toString(); 
            this.setLastOperator(newValue)//adicionar um elemeto cria um array


            //ATUALIZAR MEU DISPLAY
            this.setLastNumberToDisplay();
        }

            }


  
}


setError(){

    this.displayCalc = '[ERROR]'

}
//PONTO//
addDot(){
    let lastOperation = this.getLastOparation();
    if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
    
    if(this.isOperator(lastOperation) || !lastOperation ){
        this.pushOperator("0.");   
    }else{
        this.setLastOperator(lastOperation.toString() +'.' );
    }

    this.setLastNumberToDisplay();
}

        execBtn(value){
            this.playAudio();
            //--------------------------------------------------BOTÕES----------------------------------\\
            switch(value){
                case 'ac':
                    this.cleanAll();
                    break;
                case 'ce':
                    this.cleanEntry();
                    break; 
                    
                case 'soma':
                    this.addOperation('+')
                    break;
                case 'subtracao':
                    this.addOperation('-')
                    break;
                 case 'divisao':
                    this.addOperation('/')
                    break;
                case 'multiplicacao':
                    this.addOperation('*')
                    break;
                case 'porcento':
                    this.addOperation('%')
                    break;
                case 'igual':
                    this.calc();
                    break;
                case 'ponto':
                    this.addDot('')

                   break;

                    case '0':

                    case '1':

                    case '2':

                    case '3':

                    case '4':

                    case '5':

                    case '6':

                    case '7':

                    case '8':

                    case '9':

                    this.addOperation(parseInt(value));
                        break;
 
                default:
                    this.setError();
                    break;

            }
        }

        initButtonsEvents(){

           let buttons = document.querySelectorAll("#buttons > g, #parts > g"); /*PEGANDO O ID BUTTONS E TODAS AS CLASSES G
             Q TEM DENTRO DELE E A MESMA COISA COM A PARTS O querySelectorAll TRAZ TODOS ELEMENTOS   */ 


             buttons.forEach((btn, index) =>{//PARA CADA 

             this.addEventListenerAll(btn, 'click drag '/*aqui é adicionado os eventpos  */, e => {

                let textBtn = btn/*mostra qual é o botão*/.className/*Mostra a classe*/.baseVal/*Mostra so o nome*/.replace("btn-","");

                this.execBtn(textBtn);

             });
             
            
             this.addEventListenerAll(btn, "mouseover mouseup mousedown"/*ADICIONANDO EVENTOS BUTAO */, e =>{

                btn.style.cursor = "pointer"//MUDAR O MOUSE PARA  UMA MAOZINHA

             });

           })

           }

        setDisplayDateTime(){
            this.displayDate =  this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
                day:  "2-digit",    //DIA COM DOIS DIGITOS 
                month: 'long',  // MES NOME TODO
                year: 'numeric'// ANO NUMERICO
            });//DATA
            this.displayTime = this.displayTime = this.currentDate.toLocaleTimeString(this._locale);//HORA
           
        }
        get  displayTime(){
           return   this._timeE1.innerHTML;
        }
        
        set  displayTime(value){
            return   this._timeE1.innerHTML = value;
         }
     
    
        get displayDate(){
            return  this._dateEl.innerHTML;
        }
    
        set displayDate(value){

            return  this._dateEl.innerHTML = value;
        }
    
    
        get displayCalc(){
            
            return this._displayCalcEl.innerHTML;
    
        }
    
        set displayCalc(value){
            
            if(value.toString().length > 10){
                this.setError();
                return false;
        }
            this._displayCalcEl.innerHTML = value
    
        }
    
        get currentDate(){
            return new Date();
        }
    
        set currentDate(value){
    
            this._dataAtual = value;
        }
    }
    
    
    