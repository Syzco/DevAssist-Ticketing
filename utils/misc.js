export const capitalize = (author) => {
     let temp = author.split(" ");
          temp.forEach((v, i) => {
               temp[i] = v.replace(/^\w/, c => c.toUpperCase());
          })
     return temp.join(" ");
}

export const formatTime = (time) => {
     let t = time.split(/[- : T Z]/);
     let d = new Date(t[0], t[1], t[2], t[3], t[4], t[5]);

     return (((d.getHours()%12 == 0) ? "12" : d.getHours()%12) + ":" + d.getMinutes() + " " + ((d.getHours()/12 > 1) ? "pm" : "am") + " on " + d.getMonth() + "-" + d.getDay() + "-" + d.getFullYear());
}

export const parseSerialized = (text) => {
     return text.replace("&#39;", "'")
}