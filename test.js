// let date = new Date().getTime().toString(16)

const date2020 = new Date(2020, 1, 1)
const date2021 = new Date(2021, 1, 1)

// const datex0 = date.toString(16)
const date =
  Math.random()
    .toString(16)
    .slice(-2) +
  new Date()
    .getTime()
    .toString(16)
    .substring(2)

console.log(date)
console.log(date2020.getTime().toString(16))
console.log(date2021.getTime().toString(16))