export const data = [
    
    { name: "Target Reliability", pv: 50 },
    { name: "Actual Reliability", pv: 70 }
  ];
export const subSystemLevelData=[
    {component:'Fresh Water Cooling',reliability:80},
    {component:'Lubrication System',reliability:70},
    {component:'Sea Water Cooling',reliability:90},
    {component:'Air System for Combustion',reliability:75},
    {component:'Fuel System',reliability:50},
    {component:'Prime Performance Parts',reliability:63}
  ]
  
export const events = [
    {
      title: "Down",
      start: new Date(2021, 9, 1),
      end: new Date(2021, 9, 4),
      status: "down"
    },
    {
      title: "Mission",
      start: new Date(2021, 9, 4),
      end: new Date(2021, 9, 20),
      status: "working"
    },
    {
      title: "Maintenance",
      start: new Date(2021, 9, 20),
      end: new Date(2021, 9, 26),
      status: "maintenance"
    },
    {
      title: "Mission",
      start: new Date(2021, 9, 21),
      end: new Date(2021, 10, 5),
      status: "working"
    },
    {
      title: "Down",
      start: new Date(2021, 10, 5),
      end: new Date(2021, 10, 7),
      status: "down"
    },
    {
      title: "Mission",
      start: new Date(2021, 10, 7),
      end: new Date(),
      status: "working"
    },
  ]

  export const mainData={
    'Mission A':{
      'Talwar 1':{
        'DA1':{
          'rel':0.98,
          'Fresh Water Cooling':0.80,
          'Lubrication System':0.70,
          'Sea Water Cooling':0.90,
          'Air System for Combustion':0.75,
          'Fuel System':0.50,
          'Prime Performance Parts':0.63
      },
        'DA2':{
          'rel':0.75,
          'Fresh Water Cooling':0.50,
          'Lubrication System':0.65,
          'Sea Water Cooling':0.85,
          'Air System for Combustion':0.69,
          'Fuel System':0.77,
          'Prime Performance Parts':0.80
      },
      'Gun':{
        'rel':0.69,
        'Fresh Water Cooling':0.90,
        'Lubrication System':0.80,
        'Sea Water Cooling':0.50,
        'Air System for Combustion':0.75,
        'Fuel System':0.60,
        'Prime Performance Parts':0.83
    }
    },
    'Talwar 2':{
      'DA1':{
        'rel':0.69,
        'Fresh Water Cooling':0.90,
        'Lubrication System':0.80,
        'Sea Water Cooling':0.50,
        'Air System for Combustion':0.75,
        'Fuel System':0.60,
        'Prime Performance Parts':0.83
    },
      'DA2':{
        'rel':0.85,
        'Fresh Water Cooling':0.80,
        'Lubrication System':0.70,
        'Sea Water Cooling':0.90,
        'Air System for Combustion':0.75,
        'Fuel System':0.50,
        'Prime Performance Parts':0.63
    },
      'Gun':{
        'rel':0.75,
        'Fresh Water Cooling':0.50,
        'Lubrication System':0.65,
        'Sea Water Cooling':0.85,
        'Air System for Combustion':0.69,
        'Fuel System':0.77,
        'Prime Performance Parts':0.80
    }
  }   
  },
    'Mission B':{
      'Talwar 1':{
        'DA1':{
          'rel':0.84,
          'Fresh Water Cooling':0.88,
          'Lubrication System':0.76,
          'Sea Water Cooling':0.74,
          'Air System for Combustion':0.99,
          'Fuel System':0.66,
          'Prime Performance Parts':0.60
      },
        'DA2':{
          'rel':0.77,
          'Fresh Water Cooling':0.90,
          'Lubrication System':0.80,
          'Sea Water Cooling':0.50,
          'Air System for Combustion':0.75,
          'Fuel System':0.60,
          'Prime Performance Parts':0.83
      },
        'Gun':{
          'rel':0.69,
          'Fresh Water Cooling':0.90,
          'Lubrication System':0.80,
          'Sea Water Cooling':0.50,
          'Air System for Combustion':0.75,
          'Fuel System':0.60,
          'Prime Performance Parts':0.83
      }
    },
    'Talwar 2':{
      'DA1':{
        'rel':0.67,
        'Fresh Water Cooling':0.90,
        'Lubrication System':0.80,
        'Sea Water Cooling':0.50,
        'Air System for Combustion':0.75,
        'Fuel System':0.60,
        'Prime Performance Parts':0.83
    },
      'DA2':{
        'rel':0.95,
        'Fresh Water Cooling':0.50,
        'Lubrication System':0.65,
        'Sea Water Cooling':0.85,
        'Air System for Combustion':0.69,
        'Fuel System':0.77,
        'Prime Performance Parts':0.80
    },
      'Gun':{
        'rel':0.77,
        'Fresh Water Cooling':0.90,
        'Lubrication System':0.80,
        'Sea Water Cooling':0.50,
        'Air System for Combustion':0.75,
        'Fuel System':0.60,
        'Prime Performance Parts':0.83
    },
  }   
  }
}
  