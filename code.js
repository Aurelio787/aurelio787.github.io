 let allComponents = [];


async function loadDatabase() {

try{

const response = await fetch('database.json');

let fullDatabase = await response.json();



const GPUdb = fullDatabase.GPU;
const CPUdb = fullDatabase.CPU;
const RAMdb = fullDatabase.RAM;
const SSDDb = fullDatabase.SSD;
const PSUdb = fullDatabase.PSU;
const MBdb = fullDatabase.MB;
const CaseDb = fullDatabase.Case;
const CoolerDb = fullDatabase.Cooler;
const FanDb = fullDatabase.Fan;
const TPdb = fullDatabase.thermal_paste;

allComponents = [...GPUdb, ...CPUdb, ...RAMdb, ...SSDDb, ...PSUdb, ...MBdb, ...CaseDb, ...CoolerDb, ...FanDb, ...TPdb];

}

catch(error) {

console.error('Error loading database:', error);

}

}


loadDatabase(); 