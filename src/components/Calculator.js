import React, { Component, useContext } from "react"
import apiCall, { GET_CALC_SETTINGS } from "./Api"
import { initialize } from "./ref2"

const commaAdder = x => {
  let decimals
  if (x.toString().length <= 5) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  } else if (x.toString().length <= 7) {
    x = x / 100000
    decimals = 2
    return Number(Math.round(x + "e" + decimals) + "e-" + decimals) + " Lac"
  } else {
    x = x / 10000000
    decimals = 2
    return Number(Math.round(x + "e" + decimals) + "e-" + decimals) + " Cr"
  }
}

const totalArray = anArray => {
  let total = 0
  for (let i = 0; i < anArray.length; i++) {
    total += anArray[i]
  }
  let decimals = 0
  return this.commaAdder(
    Number(Math.round(total + "e" + decimals) + "e-" + decimals)
  )
}

const rounded = (number, decimals) => {
  return Number(Math.round(number + "e" + decimals) + "e-" + decimals)
}

const paybackYears = (cashflow, ppp, pc) => {
  pc = pc || 1
  let project_cost = pc * ppp
  let temp = 0
  let round
  let years
  for (let i = 0; i < cashflow.length; i++) {
    if (cashflow[i]) {
      temp += cashflow[i]
    }

    if (project_cost <= temp) {
      years = i
      round = (temp - project_cost) / project_cost
      let decimals = 1
      round = Number(Math.round(round + "e" + decimals) + "e-" + decimals)
      years = years + round
      return years
    }
  }
}

const IRRCalc = (values, guess) => {
  // Credits: algorithm inspired by Apache OpenOffice

  // Calculates the resulting amount
  var irrResult = function(values, dates, rate) {
    var r = rate + 1
    var result = values[0]
    for (var i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365)
    }
    return result
  }

  // Calculates the first derivation
  var irrResultDeriv = function(values, dates, rate) {
    var r = rate + 1
    var result = 0
    for (var i = 1; i < values.length; i++) {
      var frac = (dates[i] - dates[0]) / 365
      result -= (frac * values[i]) / Math.pow(r, frac + 1)
    }
    return result
  }

  // Initialize dates and check that values contains at least one positive value and one negative value
  var dates = []
  var positive = false
  var negative = false
  for (var i = 0; i < values.length; i++) {
    dates[i] = i === 0 ? 0 : dates[i - 1] + 365
    if (values[i] > 0) positive = true
    if (values[i] < 0) negative = true
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) return "#NUM!"

  // Initialize guess and resultRate
  var guess = typeof guess === "undefined" ? 0.1 : guess
  var resultRate = guess

  // Set maximum epsilon for end of iteration
  var epsMax = 1e-10

  // Set maximum number of iterations
  var iterMax = 50

  // Implement Newton's method
  var newRate, epsRate, resultValue
  var iteration = 0
  var contLoop = true
  do {
    resultValue = irrResult(values, dates, resultRate)
    newRate =
      resultRate - resultValue / irrResultDeriv(values, dates, resultRate)
    epsRate = Math.abs(newRate - resultRate)
    resultRate = newRate
    contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax
  } while (contLoop && ++iteration < iterMax)

  if (contLoop) return "#NUM!"

  // Return internal rate of return
  return resultRate
}

class Calculator extends Component {
  state = {
    calulcated: false,
    redirectTo: "",
    loading: false,
    sunHours: "",
    freeMaintYrs: "",
    debtTenure: "",
    debtRate: "",
    elecInflation: "",
    effRed1: "",
    effRed: "",
    depPercent: "",
    depAcclPercent1: "",
    depAcclPercent2: "",
    depAcclPercent3: "",
    depAcclPercent4: "",
    taxPercent: "",
    subsidyPercent: "",
    fbElecRate: "",
    CO2factor: "",
    elecBill: "",
    roofArea: "",
    elecRate: "",
    outputs: { test: "Calculator output comes here" },
    outputsToPrint: [],
    settingsLoaded: false,
    sendReport: false,
    name: "",
    email: "",
    contact: "",
    city: "",
    state: "",
    country: "",
    ip: ""
  }

  componentDidMount() {
    this.getCalcSettings()
    fetch(
      "http://api.ipstack.com/check?access_key=3af9acd78755c2f60d54a73baa551c8d"
    ).then(resp => {
      resp.json().then(data => {
        // do something with your data
        console.log(data)
        this.setState({
          ip: data.ip,
          country: data.country_name,
          state: data.region_name,
          city: data.city
        })
      })
    })
  }

  getCalcSettings = () => {
    apiCall(GET_CALC_SETTINGS).then(res => {
      if (res.errors) {
        console.log("Something went wrong", res.errors)
      } else {
        this.setState(res.data.calcSetting)
        this.setState({ settingsLoaded: true })
      }
    })
  }

  calculate = () => {
    //const {elecBill, elecRate, elecType, roofArea} = this.state
    if (!this.state.settingsLoaded) {
      alert("Settings not loaded")
      return
    }

    let { elecRate } = this.state

    if (!this.state.elecBill) {
      alert("Please enter electricity bill amount")
      return
    }

    const {
      sunHours,
      freeMaintYrs,
      debtTenure,
      debtRate,
      elecInflation,
      effRed1,
      effRed,
      depPercent,
      depAcclPercent1,
      depAcclPercent2,
      depAcclPercent3,
      depAcclPercent4,
      taxPercent,
      subsidyPercent,
      fbElecRate,
      CO2factor
    } = this.state

    if (!elecRate) {
      //this.setState({elecRate: fbElecRate})
      elecRate = fbElecRate
    }

    const inputs = {
      elecBill: this.state.elecBill,
      elecRate: elecRate,
      elecType: this.state.elecType,
      roofArea: this.state.roofArea,
      freeMaintYrs: freeMaintYrs,
      debtTenure: debtTenure,
      sunhrs: sunHours,
      effRed: effRed,
      effRed1: effRed1,
      elecInflation: elecInflation,
      debtRate: debtRate,
      depPercent: depPercent,
      depAcclPercent1: depAcclPercent1,
      depAcclPercent2: depAcclPercent2,
      depAcclPercent3: depAcclPercent3,
      depAcclPercent4: depAcclPercent4,
      taxPercent: taxPercent,
      subsidyPercent: subsidyPercent,
      subsidyCheck: false,
      acclDepCheck: true,
      extraTaxCheck: false,
      normalDepTaxBenefitCheck: false,
      taxBenefitInterestCheck: false
    }

    const outputs = initialize(inputs)
    console.log("outputs", outputs)

    let {
      plantCapacity,
      roofArearequired,
      roofAreaMessage,
      power_production_price,
      Debt,
      installment_full,
      tax_benefit_accl,
      cashflow_project,
      equity,
      cashflow_equity,
      twentyyrsavings
    } = outputs

    const outputsToPrint = [
      {
        title: "Plant Capacity",
        value: plantCapacity + "kw"
      },
      {
        title: "Power Prod Price",
        value: power_production_price / 1000 + " ₹/W"
      },
      {
        title: "Total Cost",
        value: "₹ " + commaAdder(power_production_price * plantCapacity)
      },
      {
        title: "Generation",
        value: rounded(sunHours * 365, 0) + " units/kw/yr"
      },
      {
        title: "Annual Savings",
        value: "₹ " + commaAdder(plantCapacity * 1500 * elecRate)
      },
      {
        title: "25 Year Savings",
        value: "₹ " + commaAdder(twentyyrsavings)
      },
      {
        title: "CO2 savings",
        value: plantCapacity * CO2factor + " tonnes"
      },
      {
        title: "Equity Payback",
        value: paybackYears(cashflow_equity, equity) + " years"
      },
      {
        title: "Total Project Payback",
        value:
          paybackYears(
            cashflow_project,
            power_production_price,
            plantCapacity
          ) + " years"
      },
      {
        title: "Roof Area Required",
        value: roofArearequired + " sq.ft."
      }
    ]

    this.setState({ outputsToPrint, outputs })
  }

  handleChange = (stateName, newValue) => {
    this.setState({ [`${stateName}`]: newValue })
  }

  sendReport = () => {
      if(this.state.sendReport){
        if(!this.state.name){
            alert("Please provide a name. It really helps.")
            return
        }
        if(!this.state.email){
            alert("Please provide your email. We don't spam. Sacchi.")
            return
        }
        if(!this.state.contact){
            alert("Please provide your contact. We promise we will email you first.")
            return
        }
        
      } else {
          this.setState({ sendReport: true })
      }
  }

  render() {
    // const user = useContext(UserContext);

    return (
      <div style={{ display: "flex", flexDirection: "column", padding: 18 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <div style={{ flex: 1 }} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <FormInput
            label="Electricity Bill"
            name="elecBill"
            onChange={this.handleChange}
            required
            value={this.state.elecBill}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Connection Type</label>
            <select
              style={{ border: "none", padding: 8, margin: 8, borderRadius: 4 }}
              value={this.state.elecType}
              id="dropDownId"
              onChange={event =>
                this.setState({ elecType: event.target.value })
              }
            >
              <option value="domestic">Domestic</option>
              <option value="nondomestic">Non-Domestic</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
          <FormInput
            label="Roof Area (sqft)"
            name="roofArea"
            onChange={this.handleChange}
            value={this.state.roofArea}
          />
          <FormInput
            label="Elec Rate (per unit)"
            name="elecRate"
            onChange={this.handleChange}
            value={this.state.elecRate}
          />
          <button
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "bold",
              padding: 8,
              border: "none",
              borderRadius: 6,
              background: "#27ae60",
              paddingLeft: 16,
              paddingRight: 16,
              marginLeft: 8,
              marginRight: 8,
              cursor: "pointer"
            }}
            onClick={this.calculate}
          >
            CALCULATE
          </button>
        </div>
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {this.state.outputsToPrint.map((item, index) => {
            return (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 6,
                  boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.08)",
                  padding: 12,
                  margin: 18
                }}
                key={index}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>
                    {item.title}
                  </span>
                  <span style={{ textAlign: "center" }}>{item.value}</span>
                </div>
              </div>
            )
          })}
          </div>
          <div>
          
          {this.state.sendReport && (
            <div>
              <FormInput
                label="Name"
                name="name"
                onChange={this.handleChange}
                value={this.state.name}
              />
              <FormInput
                label="Email ID"
                name="email"
                onChange={this.handleChange}
                value={this.state.email}
              />
              <FormInput
                label="Contact"
                name="contact"
                onChange={this.handleChange}
                value={this.state.contact}
              />
              <FormInput
                label="City"
                name="city"
                onChange={this.handleChange}
                value={this.state.city}
              />
              <FormInput
                label="State"
                name="state"
                onChange={this.handleChange}
                value={this.state.state}
              />
              <FormInput
                label="Country"
                name="country"
                onChange={this.handleChange}
                value={this.state.country}
              />
            </div>
          )}
          {!!this.state.outputsToPrint.length && (
            <button
              style={{
                color: "#fff",
                fontSize: 14,
                padding: 8,
                border: "none",
                borderRadius: 6,
                background: "#27ae60",
                paddingLeft: 16,
                paddingRight: 16,
                marginLeft: 8,
                marginRight: 8,
                cursor: "pointer"
              }}
              onClick={this.sendReport}
            >
              {this.state.sendReport?"SEND EMAIL":"Email yourself a Detailed Report"}
            </button>
          )}
        </div>
      </div>
    )
  }
}

const FormInput = props => {
  //   render() {
  const { label, name, placeholder, required, value, warningText } = props
  // console.log("Name", name)
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "12px" }}>
      <label>
        {label}
        {required && <span style={{ color: "#EF5350" }}>*</span>}
      </label>
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "12px" }}
      >
        <input
          style={{
            padding: 6,
            borderRadius: 4,
            fontSize: 16
          }}
          name={name}
          value={value}
          onChange={e => {
            props.onChange(e.target.name, e.target.value)
          }}
          placeholder={placeholder}
        />
        <span style={{ color: "#ef5350", fontSize: 12 }}>{warningText}</span>
      </div>
    </div>
  )
  //   }
}

export default Calculator
