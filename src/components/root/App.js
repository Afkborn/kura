import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Col,
  ButtonGroup,
  Row,
} from "reactstrap";
import { useState, useEffect } from "react";
import Navi from "../navi/Navi";
import Footer from "../footer/Footer";
import RangeSlider from "react-bootstrap-range-slider";
import Papa from "papaparse";
import KuraSonucList from "../common/KuraSonucList";
import { CSVLink } from "react-csv";

function App() {
  const [csvData, setCsvData] = useState([]);
  const [isSelectFile, setIsSelectFile] = useState(false);
  const [kazananSayisi, setKazananSayisi] = useState(1);
  const [slowDraw, setSlowDraw] = useState(false);
  const [slowInterval, setSlowInterval] = useState(1000);
  const [yedekVarMi, setYedekVarMi] = useState(false);
  const [yedekSayisi, setYedekSayisi] = useState(1);
  const [kuraBasladiMi, setKuraBasladiMi] = useState(false);
  const [totalKisiSayisi, setTotalKisiSayisi] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [kazananlar, setKazananlar] = useState([]);
  const [yedekler, setYedekler] = useState([]);
  const [cSelected, setCSelected] = useState([]);
  const [kazananlarYSK] = useState([]);

  useEffect(() => {}, [kazananlar]);

  const onCheckboxBtnClick = (selected) => {
    const index = cSelected.indexOf(selected);
    if (index < 0) {
      cSelected.push(selected);
    } else {
      cSelected.splice(index, 1);
    }
    setCSelected([...cSelected]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (kazananSayisi > totalKisiSayisi) {
      alert("Kazanan sayısı toplam kişi sayısından fazla olamaz.");
      return;
    }

    if (csvData.length === 0) {
      alert("Lütfen bir CSV dosyası seçiniz.");
      return;
    }
    if (
      parseInt(yedekSayisi) + parseInt(kazananSayisi) >
      parseInt(totalKisiSayisi)
    ) {
      alert("Toplam kişi sayısından fazla kazanan seçtiniz");
      return;
    }
    if (cSelected.length === 0) {
      alert(
        "Lütfen kazananların bilgilerini görmek istediğiniz alanları seçiniz."
      );
      return;
    }

    let kuraListe = csvData;
    let kazananlar = [];
    for (let i = 0; i < kazananSayisi; i++) {
      let min = 0;
      let max = kuraListe.length - 1;
      const rand = min + Math.random() * (max - min);
      const randInt = Math.floor(rand);

      let kazanan = kuraListe[randInt];
      kazananlar.push(kazanan);

      // sandik_no, tc, ad, soyad, kurum, tel, egitim_yeri, egitim_tarihi, egitim_saati
      kazananlarYSK.push({
        sandik_no: "sandik_no",
        tc: kazanan["TC"],
        ad: kazanan["AD"],
        soyad: kazanan["SOYAD"],
        kurum: kazanan["KURUMADI"],
        tel: kazanan["CEP TELEFONU"],
        egitim_yeri: "egitim_yeri",
        egitim_tarihi: "egitim_tarihi",
        egitim_saati: "egitim_saati",

      });
      kuraListe.splice(randInt, 1);
      shuffle(kuraListe); // shuffle the list
    }

    setKazananlar(kazananlar);

    if (yedekVarMi) {
      let yedekler = [];
      for (let i = 0; i < yedekSayisi; i++) {
        let min = 0;
        let max = kuraListe.length - 1;
        const rand = min + Math.random() * (max - min);
        const randInt = Math.floor(rand);
        yedekler.push(kuraListe[randInt]);
        kuraListe.splice(randInt, 1);
        shuffle(kuraListe);
      }
      setYedekler(yedekler);
    }
    setKuraBasladiMi(true);
  };

  const handleRepeat = (event) => {
    // repeat page
    window.location.reload();
  };

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setHeaders(results.meta.fields);
          setTotalKisiSayisi(results.data.length);
          setCsvData(results.data);
          setIsSelectFile(true);
        },
      });
    }
  };


  return (
    <Container className="mt-5">
      <Navi />
      <Form hidden={kuraBasladiMi}>
        <FormGroup>
          <Label for="csvFile">Dosya</Label>
          <Input
            type="file"
            name="file"
            id="csvFile"
            accept=".csv"
            onChange={handleFileChange}
          />
          <FormText color="muted">Dosyanız CSV formatında olmalıdır.</FormText>
          <FormText hidden={csvData.length === 0} color="muted">
            Toplam kişi sayısı : {totalKisiSayisi}
          </FormText>
        </FormGroup>
        <FormGroup>
          <ButtonGroup>
            {headers.map((header) => (
              <Button
                color="primary"
                outline
                onClick={() => onCheckboxBtnClick(header)}
                active={cSelected.includes(header)}
              >
                {header}
              </Button>
            ))}
          </ButtonGroup>
        </FormGroup>
        <div hidden={!isSelectFile}>
          <FormGroup>
            <Container>
              <Row>
                <Col xs="9">
                  <Label for="kazananSayisi">Kazanan sayısı</Label>
                  <RangeSlider
                    value={kazananSayisi}
                    onChange={(e) => setKazananSayisi(e.target.value)}
                    min={1}
                    max={totalKisiSayisi}
                    tooltipLabel={(currentValue) => `${currentValue} kişi`}
                    tooltip="on"
                  />
                </Col>
                <Col xs="2" className="text-center">
                  <Input
                    className="mt-4"
                    type="text"
                    onChange={(e) => setKazananSayisi(e.target.value)}
                    value={kazananSayisi}
                  />
                </Col>
              </Row>
            </Container>
          </FormGroup>
          <FormGroup className="mt-3" check inline>
            <Label check>
              <Input
                type="checkbox"
                onChange={(e) => setSlowDraw(e.target.checked)}
              />{" "}
              Yavaşlat{" "}
              <FormText color="muted">Kura çekme işlemi yavaşlatılır.</FormText>
            </Label>

            <FormGroup hidden={!slowDraw}>
              <RangeSlider
                value={slowInterval}
                onChange={(e) => setSlowInterval(e.target.value)}
                min={100}
                max={3000}
                tooltipLabel={(currentValue) => `${currentValue / 1000}s`}
                tooltip="on"
              />
            </FormGroup>
          </FormGroup>

          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                onChange={(e) => setYedekVarMi(e.target.checked)}
              />{" "}
              Yedek liste oluştur
            </Label>

            <FormGroup hidden={!yedekVarMi}>
              <RangeSlider
                value={yedekSayisi}
                onChange={(e) => setYedekSayisi(e.target.value)}
                min={1}
                max={totalKisiSayisi - kazananSayisi}
                tooltipLabel={(currentValue) => `${currentValue} kişi`}
                tooltip="on"
              />
            </FormGroup>
          </FormGroup>
        </div>
        <Button className="mt-3" onClick={(e) => handleFormSubmit(e)}>
          Kurayı başlat
        </Button>
      </Form>

      <div hidden={!kuraBasladiMi}>
        <div>
          <h3>Kazananlar - ASİL</h3>
          <KuraSonucList
            visible={kuraBasladiMi}
            list={kazananlar}
            header={cSelected}
            slowDraw={slowDraw}
            slowInterval={slowInterval}
            durum={"Asil"}
          />
        </div>
        <div hidden={!yedekVarMi}>
          <h3>Kazananlar - YEDEK</h3>
          <KuraSonucList
            visible={kuraBasladiMi}
            list={yedekler}
            header={cSelected}
            slowDraw={slowDraw}
            slowInterval={slowInterval}
            durum={"Yedek"}
          />
        </div>
        <Button onClick={(e) => handleRepeat(e)}>Baştan başla</Button>
        <CSVLink filename="kazananliste_ysk" className="button" data={kazananlarYSK}>Kazanan Liste İndir (YSK yüklemeye uyumlu)</CSVLink>
        <CSVLink filename="kazananliste" data={kazananlar}>Kazanan Liste İndir (Tüm veri)</CSVLink>
        <CSVLink data={csvData}>Kalan Liste İndir</CSVLink>

      </div>
      <Footer />
    </Container>
  );
}

export default App;
