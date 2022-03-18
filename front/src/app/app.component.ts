import { analyzeAndValidateNgModules, ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Calculator';


  constructor(private http: HttpClient) { }

  result2 = '';
  input2 = '';
  prevInput = '';
  firstOperand = '';
  secondOperand = '';
  operator = '';
  havedot = false;
  oneOperand = false;
  checkequal = false;
  message = '';
  op = false;
  one = ''; //for oneoperand equations
  temp = '';
  per = false;//for percent

  checkPrevious() {
    var bool = this.prevInput.includes("+") || this.prevInput.includes("-") || this.prevInput.includes("×") || this.prevInput.includes("÷");
    return bool && (this.input2 === '');
  }

  display(e: string) {
    this.message = "";
    //2t2kd 2no fdaha b3d operation
    if (this.op) {
      this.input2 = '';
      this.op = false;
    }


    if (!this.checkequal) {
      if (e === "." && !(this.havedot)) {
        this.havedot = true;
        this.input2 = this.input2 + e;

      } else if (e === "." && this.havedot) {
        return;
        //can't

      } else if (e !== ".") {
        //to be clear for the second operand
        this.input2 = this.input2 + e;
        // this.checkequal=false;  
      }
    } else {
      //if 3yza 2d5l rkm b3d equal
      this.clear();
      this.checkequal = false;
    }

  }


  operation(e: string) {
    this.message = "";
    this.havedot = false;
    this.checkequal = false;
    this.op = true;
    this.checkDisplay();
    //enter operator without operand
    if (this.oneOperand) {
      //if one operand is inthe begin
      console.log("op " +this.oneOperand);
      this.operator = e;
      this.prevInput = this.input2 + " " + this.operator;
      this.firstOperand = this.input2;
      this.oneOperand = false
      console.log("opp " +this.oneOperand);
    }
    else if (this.prevInput === '' || this.temp !== '') {//temp for one operand
      //for the first operation
      this.firstOperand = this.input2;
      this.operator = e;
      this.prevInput = this.input2 + " " + this.operator;
      this.input2 = '';
      this.temp = '';
    } else {//not the first operator we must calculate 
      this.secondOperand = this.input2;
      this.mathOperation();
      this.operator = e;
      this.prevInput = this.prevInput + " " + e;
      this.input2 = '';
      this.oneOperand = false;
    }
  }

  mathOperation() {
    this.http.get('http://localhost:8080/back/operation', {
      responseType: 'text',
      params: {
        firstOperand: this.firstOperand,
        secondOperand: this.secondOperand,
        operator: this.operator
      },
      observe: "response"
    })
      .subscribe((response) => {
        if (response.body === "error!") {
          this.clear();
          this.message = "cannot divide by zero";
        } else {
          this.result2 = response.body!;
          this.prevInput = response.body!;
          //to remove the .0
          if (this.prevInput.charAt(this.prevInput.length - 1) == "0" && this.prevInput.charAt(this.prevInput.length - 2) == ".") {
            this.input2 = this.prevInput.slice(0, -2);
            if (!(this.checkequal) && !(this.oneOperand)) {
              this.prevInput = this.prevInput.slice(0, -2) + " " + this.operator;
            } else if (this.checkequal) {
              //if it is equal
              this.prevInput = '';
            } else { //oneoperand
              //this.prevInput = this.prevInput.slice(0, -2);
              this.prevInput = this.temp;
              this.oneOperand = false;
            }
            this.result2 = this.result2.slice(0, -2);
            this.firstOperand = this.result2;
          } else {
            this.input2 = this.prevInput;
            if (this.checkequal) { return; }
            if (this.per) { this.per = false; return; }
            if (this.oneOperand) { this.prevInput = this.prevInput; return; }
            this.prevInput = this.prevInput + " " + this.operator;
          }
        }
      }
      )

  }

  equal() {
    this.havedot = false;
    this.checkDisplay();
    
    if (this.oneOperand) {  
      //if press equal after unary  
      return;
    }
    if (this.input2 !== "" && this.operator === "" && this.secondOperand === "") {
      this.firstOperand = this.input2;
      return;
    }
   /* if (this.firstOperand !== "" && this.operator !== "" && this.secondOperand === "") {
      this.secondOperand = this.firstOperand;
      this.checkequal = true;
      this.mathOperation();
      return;
    }*/
    if (this.checkPrevious()) {
      this.input2 = '0';
    }
    // if enter one value then equal will consider as first operand
    if (!this.checkequal) {
      console.log("h " +this.oneOperand);

      if(this.oneOperand || this.temp!==''){this.temp='';return;}
      this.secondOperand = this.input2;
      this.mathOperation();
      this.input2 = this.result2;
      this.checkequal = true;
      this.oneOperand = false;
    } /*else {
      //the previous is already equal
      if(this.oneOperand){return;}
      console.log("hee "); 
      this.firstOperand = this.result2;
      this.mathOperation();
      this.input2 = this.result2;
      this.oneOperand = false; //NEW
    }*/
  }


  //if he doesn't enter any operand before make the operand=0        
  checkDisplay() {
    if (this.input2 === '') {
      this.input2 = '0';
    }
  }




  square() {
    if (!this.oneOperand) {
      this.oneOperand = true;

      this.checkDisplay();
      this.temp = this.prevInput + "sqr(" + this.input2 + ")";
      this.prevInput = this.prevInput + "sqr(" + this.input2 + ")";

      this.http.get('http://localhost:8080/back/squaring', {
        responseType: 'text',
        params: {
          input2: this.input2,

        },
        observe: "response"
      })
        .subscribe((response) => {
          this.one = (response.body)!;
          this.input2 = (response.body)!;
          if (this.input2.charAt(this.input2.length - 1) == "0" && this.input2.charAt(this.input2.length - 2) == ".") {
            this.one = this.one.slice(0, -2);
            this.input2 = this.input2.slice(0, -2);

          }
          if (this.result2 !== "" || this.firstOperand !== "") {
            this.secondOperand = this.one;
            this.mathOperation();
            this.input2 = "";

          }
        })
        console.log("sq "+this.oneOperand);

    }
    //there is operation before it

  }
  root() {
    if (!this.oneOperand) {

      this.checkDisplay();
      this.temp = this.prevInput + "√(" + this.input2 + ")";
      this.prevInput = "√(" + this.input2 + ")";
      this.http.get('http://localhost:8080/back/root', {
        responseType: 'text',
        params: {
          input2: this.input2,

        },
        observe: "response"
      })
        .subscribe((response) => {
          if (response.body === "error!") {
            this.clear();
            this.message = "Invalid input";
          } else {
            this.oneOperand = true;
            this.one = (response.body)!;
            this.input2 = (response.body)!;

            if (this.input2.charAt(this.input2.length - 1) == "0" && this.input2.charAt(this.input2.length - 2) == ".") {
              this.one = this.one.slice(0, -2);
              this.input2 = this.input2.slice(0, -2);
            }
            if (this.result2 !== "" || this.firstOperand !== "") {
              this.secondOperand = this.one;
              this.mathOperation();
              this.input2 = "";

            }
          }
        })

    }
  }

  fraction() {

    if (!this.oneOperand) {
      this.checkDisplay();
      this.temp = this.prevInput + "(1/" + this.input2 + ")";
      this.prevInput = "(1/" + this.input2 + ")";
      //this.result2 = 1 / parseFloat(this.input2);
      this.http.get('http://localhost:8080/back/fraction', {
        responseType: 'text',
        params: {
          input2: this.input2,

        },
        observe: "response"
      })
        .subscribe((response) => {
          if (response.body === "error!") {
            this.clear();
            this.message = "cannot divide by zero";
          } else {
            this.oneOperand = true;
            this.one = (response.body)!;
            this.input2 = (response.body)!;

            if (this.input2.charAt(this.input2.length - 1) == "0" && this.input2.charAt(this.input2.length - 2) == ".") {
              this.one = this.one.slice(0, -2);
              this.input2 = this.input2.slice(0, -2);
            }

            if (this.result2 !== "" || this.firstOperand !== "") {
              this.secondOperand = this.one;
              this.mathOperation();
              this.input2 = "";

            }
          }
        })

    }
  }

  backSpace() {
    if(this.oneOperand||this.op){return;} //cann't do back space in sqr or operator space
    if (!this.checkequal) {

      if (this.input2.charAt(this.input2.length - 1) === '.') {
        this.havedot = false;
      }
      this.input2 = this.input2.slice(0, -1);
    }

  }
  clear() {
    this.input2 = '';
    this.prevInput = '';
    this.firstOperand = '';
    this.secondOperand = '';
    this.operator = '';
    this.result2 = "";
    this.message = "";
    this.op = false;
    this.havedot = false;
    this.oneOperand = false;
    this.checkequal = false;
    this.temp = '';
    this.per = false;
  }
  clearE() {
    this.input2 = '';
    this.oneOperand = false;
    this.checkequal = false;
  }

  sign() {
    if (this.input2 === '' && this.prevInput === '') {
      return;
    };
    if (this.input2.charAt(0) == '-') {
      //if it is already -ve remove the negative
      this.input2 = this.input2.slice(1, this.input2.length);
    }
    else {
      this.input2 = "-" + this.input2;
    }
  }
  //not yet
  

  percent() {
    this.per = true;
    if (!this.oneOperand) {

      if (this.input2 === "") {
        this.checkDisplay();
        return;
      } else {
        this.http.get('http://localhost:8080/back/percent', {
          responseType: 'text',
          params: {
            firstOperand: this.firstOperand,
            secondOperand: this.input2,
            operator: this.operator

          },
          observe: "response"
        })
          .subscribe((response) => {

            this.result2 = (response.body)!;
            this.input2 = (response.body)!;

            if (this.input2.charAt(this.input2.length - 1) == "0" && this.input2.charAt(this.input2.length - 2) == ".") {
              this.result2 = this.result2.slice(0, -2);
              this.input2 = this.input2.slice(0, -2);
            }
            if (this.operator === "-" || this.operator === "+") {
              this.prevInput = this.firstOperand + " " + this.operator + " " + this.input2;
              this.secondOperand = this.result2;
              this.mathOperation();
              this.oneOperand = true;
            } else {
              this.prevInput = this.input2;

            }


          })
      }

    }
  }
}

