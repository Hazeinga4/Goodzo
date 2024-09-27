
-- Medewerker
INSERT INTO `goodco2gether`.`medewerker` (`idMedewerker`, `Personeelsnummer`, `Voornaam`, `Achternaam`) VALUES ('1', '123', 'Dick', 'Schoof');

-- Leaseauto
INSERT INTO `goodco2gether`.`leaseauto` (`idLeaseAuto`, `Kenteken`, `Merk`, `Type`, `Model`, `VerbruikPerKilometer`, `IsHuidigeLeaseAuto`, `Medewerker_idMedewerker`)
VALUES ('1', 'N016JJ', 'Ferrari', 'California', 'F149', '0.14', '1', '1');

-- Locaties
INSERT INTO `goodco2gether`.`locatie` (`Situatie`, `LocatieNaam`, `Plaats`, `Straat`, `Huisnummer`, `Latitude`, `Longitude`, `IsActieveKlantlocatie`, `Medewerker_idMedewerker`)
VALUES ('Goodzo HQ', 'Goodzo HQ', 'Zoetermeer', 'Bredewater', '16', '52.05349442498061', '4.476574827697931', '0', '1');
INSERT INTO `goodco2gether`.`locatie` (`Situatie`, `LocatieNaam`, `IsActieveKlantlocatie`, `Medewerker_idMedewerker`)
VALUES ('Anders', 'Anders', '0', '1');
INSERT INTO `goodco2gether`.`locatie` (`Situatie`, `LocatieNaam`, `Plaats`, `Straat`, `Huisnummer`, `Latitude`, `Longitude`, `IsActieveKlantlocatie`, `Medewerker_idMedewerker`)
VALUES ('Thuis', 'Thuis', 'Den Haag', 'Binnenhof', '17', '52.08034332831668', '4.313969237102342', '0', '1');
INSERT INTO `goodco2gether`.`locatie` (`Situatie`, `LocatieNaam`, `Plaats`, `Straat`, `Huisnummer`, `Latitude`, `Longitude`, `IsActieveKlantlocatie`, `Medewerker_idMedewerker`)
VALUES ('Klantlocatie', 'De Rotterdam', 'Rotterdam', 'Wilhelminakade', '179', '51.90658641853315', '4.488572132760908', '1', '1');
INSERT INTO `goodco2gether`.`locatie` (`Situatie`, `LocatieNaam`, `Plaats`, `Straat`, `Huisnummer`, `Latitude`, `Longitude`, `IsActieveKlantlocatie`, `Medewerker_idMedewerker`)
VALUES ('Klantlocatie', 'ZPW', 'Rotterdam', 'Zuiderparkweg', '300', '51.8730676212239', '4.478144215448467', '1', '1');

-- Werkdagen
INSERT INTO `goodco2gether`.`werkdag` (`Datum`, `AantalBlikjesDrinkenOpHQ`, `AantalBeeldschermen`, `AantalUrenBeeldschermenAan`, `AantalVerzoekenAanChatGPT`, `Medewerker_idMedewerker`, `BasisLocatie_idLocatie`) VALUES ('2024-07-01', '6', '3', '8', '12', '1', '1');
INSERT INTO `goodco2gether`.`werkdag` (`Datum`, `AantalBlikjesDrinkenOpHQ`, `AantalBeeldschermen`, `AantalUrenBeeldschermenAan`, `AantalVerzoekenAanChatGPT`, `Medewerker_idMedewerker`, `BasisLocatie_idLocatie`) VALUES ('2024-07-02', '0', '3', '9', '3', '1', '2');
INSERT INTO `goodco2gether`.`werkdag` (`Datum`, `AantalBlikjesDrinkenOpHQ`, `AantalBeeldschermen`, `AantalUrenBeeldschermenAan`, `AantalVerzoekenAanChatGPT`, `Medewerker_idMedewerker`, `BasisLocatie_idLocatie`) VALUES ('2024-07-03', '0', '2', '6', '21', '1', '3');

-- Ritten
INSERT INTO `goodco2gether`.`rit` (`VanLatitude`, `VanLongitude`, `NaarLatitude`, `NaarLongitude`, `VanAdres`, `NaarAdres`, `AantalKilometers`, `Werkdag_idWerkdag`, `Van`, `Naar`) VALUES ('52.08034332831668', '4.313969237102342', '52.0535', '4.47657', 'Binnenhof 17, Den Haag', 'Bredewater 16, Zoetermeer', '15.7', '1', '3', '1');
INSERT INTO `goodco2gether`.`rit` (`VanLatitude`, `VanLongitude`, `NaarLatitude`, `NaarLongitude`, `VanAdres`, `NaarAdres`, `AantalKilometers`, `Werkdag_idWerkdag`, `Van`, `Naar`) VALUES ('52.0535', '4.47657', '52.08034332831668', '4.313969237102342', 'Bredewater 16, Zoetermeer', 'Binnenhof 17, Den Haag', '15.9', '1', '1', '3');
INSERT INTO `goodco2gether`.`rit` (`VanLatitude`, `VanLongitude`, `NaarLatitude`, `NaarLongitude`, `VanAdres`, `NaarAdres`, `AantalKilometers`, `Werkdag_idWerkdag`, `Van`, `Naar`) VALUES ('52.08034332831668', '4.313969237102342', '51.9066', '4.48857', 'Binnenhof 17, Den Haag', 'Wilhelminakade 179, Rotterdam', '20.3', '3', '3', '4');
INSERT INTO `goodco2gether`.`rit` (`VanLatitude`, `VanLongitude`, `NaarLatitude`, `NaarLongitude`, `VanAdres`, `NaarAdres`, `AantalKilometers`, `Werkdag_idWerkdag`, `Van`, `Naar`) VALUES ('51.9066', '4.48857', '52.08034332831668', '4.313969237102342', 'Wilhelminakade 179, Rotterdam', 'Binnenhof 17, Den Haag', '21.4', '3', '4', '3');