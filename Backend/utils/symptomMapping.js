function getSymptomMap() {

    const symptoms = [
        ["Pusing", "Diare", "Jantung berdebar kencang"],
        ["Demam", "Keputihan", "Batuk pilek"],
        ["Mual muntah", "Pendarahan/keluar cairan", "Sesak nafas"],
        ["Sakit perut", "Sakit saat BAK", ""],
    ];

    const symptomIds = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
        10, 11,
    ];

    const map = {};
    symptomIds.forEach((id, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const name = symptoms[row][col];
        if (name) map[id] = name;
    });
    
    return map;
}

function convertSymptoms(dataArray) {

  if(dataArray.length){
    const map = getSymptomMap();
    return dataArray.map(entry => ({
      ...entry,
      gejala: Array.isArray(entry.gejala) && entry.gejala.length > 0
        ? entry.gejala.map(id => map[id]).filter(Boolean)
        : []
      }));
  }else{
    return [];
  }
}

module.exports = {
  getSymptomMap,
  convertSymptoms
};
