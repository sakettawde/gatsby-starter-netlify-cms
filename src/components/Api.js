import axios from "axios"

const axiosStellarGraphQL = axios.create({
  baseURL: "https://stellar-grid-c70422d2bc.herokuapp.com/dev/dev"
})

const apiCall = async (query, variables = {}) => {
  const response = await axiosStellarGraphQL.post("", { query, variables })

  return { data: response.data.data, errors: response.data.errors }

  // .then(result =>{
  //   console.log(
  //     "GraphQL result data",
  //     result.data.data,
  //     "GraphQL result error",
  //     result.data.errors
  //   )
  //   // result2 = {data: result.data.data, errors:result.data.errors}
  // }
  // )
}

export default apiCall

export const ADD_WEBLEAD = `
mutation()
`

export const GET_WEBLEADS = `
query{
  
}
`

export const UPDATE_USER_SUP = `
mutation($email:String!,$id:ID!){
  updateUser(data:{
    superiors:{
      connect:{
        id:$id
      }
    }
  }
  where:{
    email: $email
  }){
    id
    email
    role
    name
    status
    phNo
    photoUrl
    uid
    superiors{
      id
      name
      email
    }
  }
}
`

export const UPDATE_USER_ROLE = `
mutation($email:String!,$role:String!){
  updateUser(data:{
    role:$role
  }
  where:{
    email: $email
  }){
    id
    email
    role
    name
    status
    phNo
    photoUrl
    uid
  }
}
`

export const GET_USERS = `
query{
  users{
    id
    email
    role
    name
    status
    phNo
    photoUrl
    uid
    superiors{
      id
      name
      email
    }
  }
}
`

export const UPDATE_USERS = `
mutation($email:String!,$name:String!,$photoURL:String,$uid:String!){
  upsertUser(where:{
    email:$email
  }
    create:{
      email:$email
    name:$name
    photoUrl:$photoURL
    uid:$uid
    }
    update:{
    }
  ){
    id
    email
    role
    name
    status
    phNo
    photoUrl
    uid
  }
}
`

export const GET_CONTACTS = `
  {
    contacts {
      id
      name
      company
      contactNo
      email
      altContactNo
      designation
      building
      lane
      area
      city
      state
      country
    }
  }
`

export const GET_CALC_SETTINGS = `
query {
  calcSetting(where:{
    id:"cjou5qsi1000m083550s1m2zn"
  }) {
    id
    sunHours
    freeMaintYrs
    debtTenure
    debtRate
    elecInflation
    effRed1
    effRed
    depPercent
    depAcclPercent1
    depAcclPercent2
    depAcclPercent3
    depAcclPercent4
    taxPercent
    subsidyPercent
    fbElecRate
    CO2factor
  }
}
`

export const UPDATE_CALC_SETTINGS = `
mutation(
  $sunHours: String!,
  $freeMaintYrs: String!,
  $debtTenure: String!,
  $debtRate: String!,
  $elecInflation: String!,
  $effRed1: String!,
  $effRed: String!,
  $depPercent: String!,
  $depAcclPercent1: String!,
  $depAcclPercent2: String!,
  $depAcclPercent3: String!,
  $depAcclPercent4: String!,
  $taxPercent: String!,
  $subsidyPercent: String!,
  $fbElecRate: String!,
  $CO2factor: String!
){
  updateCalcSetting(data:{
    sunHours: $sunHours
freeMaintYrs: $freeMaintYrs
debtTenure: $debtTenure
debtRate: $debtRate
elecInflation: $elecInflation
effRed1: $effRed1
effRed: $effRed
depPercent: $depPercent
depAcclPercent1: $depAcclPercent1
depAcclPercent2: $depAcclPercent2
depAcclPercent3: $depAcclPercent3
depAcclPercent4: $depAcclPercent4
taxPercent: $taxPercent
subsidyPercent: $subsidyPercent
fbElecRate: $fbElecRate
CO2factor: $CO2factor
  },where:{id:"cjou5qsi1000m083550s1m2zn"}) {
    sunHours
  freeMaintYrs
  debtTenure
  debtRate
  elecInflation
  effRed1
  effRed
  depPercent
  depAcclPercent1
  depAcclPercent2
  depAcclPercent3
  depAcclPercent4
  taxPercent
  subsidyPercent
  fbElecRate
  CO2factor
  }
}
`

export const ADD_CONTACT = `
mutation($name: String!,
  $company: String!,
  $contactNo: String!,
  $email: String!,
  $altContactNo: String,
  $designation: String,
  $building: String,
  $lane: String,
  $area: String,
  $city: String!,
  $state: String!,
  $country: String!) {
    createContact(data: {
      name: $name
      company: $company
      contactNo: $contactNo
      email: $email
      altContactNo: $altContactNo
      designation: $designation
      building: $building
      lane: $lane
      area: $area
      city: $city
      state: $state
      country: $country
    }) {
      id
      name
    }
  }
`

export const ADD_USER = `
mutation($newName: String!) {
    createUser(data: {
      name: $newName
    }) {
      id
      name
    }
  }
`

