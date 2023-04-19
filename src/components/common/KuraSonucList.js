import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
function KuraSonucList({ visible, list, slowDraw, slowInterval, durum }) {
  const [kazananlar, setKazananlar] = useState([]);
  useEffect(() => {
    if (slowDraw) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < list.length) {
          i++;
          console.log("i: ", i);
          setKazananlar(list.slice(0, i));
        } else {
          clearInterval(interval);
        }
      }, slowInterval);
    } else {
      setKazananlar(list);
    }
  }, [slowDraw, slowInterval, list]);

  return (
    <div>
      {visible && (
        <Table>
          <thead>
            <tr>
              <th>Sıra Numarası</th>
              <th>T.C Kimlik Numarası</th>
              <th>Adı</th>
              <th>Soyadı</th>
              <th>Cep Telefonu</th>
              <th>Kurumu</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {kazananlar.map((kazanan, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{kazanan["TC Kimlik Numarası"]}</td>
                <td>{kazanan["Adı"]}</td>
                <td>{kazanan["Soyadı"]}</td>
                <td>{kazanan["Cep Telefonu"]}</td>
                <td>{kazanan["Kurumu"]}</td>
                <td>{durum}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default KuraSonucList;
