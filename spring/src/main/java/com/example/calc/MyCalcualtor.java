package com.example.calc;

import org.springframework.web.bind.annotation.*;
@CrossOrigin (origins = "http://localhost:4200") // port of front 4200 with back end 8080
@RestController //connect the front end to backend
@RequestMapping("/back")
public class MyCalcualtor {
  String finalResult="";
  String message="error!";
  double Result = 0;
  @GetMapping("/operation")
  public String operation(@RequestParam String firstOperand, @RequestParam String secondOperand, @RequestParam String operator) {
    double first=Double.valueOf(firstOperand);
    double second=Double.valueOf(secondOperand);
    if (operator.equals(" ")) {
      Result = first + second;
      finalResult=String.valueOf(Result);
    } else if (operator.equals("-")) {
      Result = first - second;
      finalResult=String.valueOf(Result);
    } else if (operator.equals("÷")) {
      if (second==0)
        return "error!";
      this.Result = (first / second);
      finalResult=String.valueOf(Result);
    } else {
      this.Result = first * second;
      finalResult=String.valueOf(Result);

    }
    return finalResult;
  }
  @GetMapping("/squaring")
  public String square(@RequestParam String input2){
    double sqr=Math.pow(Double.valueOf(input2),2);
    return String.valueOf(sqr);

  }
  @GetMapping("/root")
  public String root(@RequestParam String input2){
    double sqr=Double.parseDouble(input2);
    if(sqr<0)
      return "error!";
    sqr=Math.pow(sqr,0.5);
    return String.valueOf(sqr);

  }
  @GetMapping("/fraction")
  public String fraction(@RequestParam String input2){
    double num=Double.parseDouble(input2);
    if(num==0)
      return "error!";
    num=Math.pow(num,-1);
    return String.valueOf(num);
  }
 @GetMapping("/percent")
  public String percent(@RequestParam String firstOperand,@RequestParam String secondOperand, @RequestParam String operator){
   double first=Double.valueOf(firstOperand);
   double second=Double.valueOf(secondOperand);

        Result=(first*second)*Math.pow(10,-2);
        finalResult=String.valueOf(Result);
  return finalResult;
  }
  }
//http://localhost:8080/back/operation?firstOperand=2&&secondOperand=6.2&&operator=*



