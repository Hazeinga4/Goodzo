-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema GoodCO2gether
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema GoodCO2gether
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `GoodCO2gether` DEFAULT CHARACTER SET utf8 ;
USE `GoodCO2gether` ;

-- -----------------------------------------------------
-- Table `GoodCO2gether`.`Medewerker`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GoodCO2gether`.`Medewerker` ;

CREATE TABLE IF NOT EXISTS `GoodCO2gether`.`Medewerker` (
  `idMedewerker` INT NOT NULL AUTO_INCREMENT,
  `Personeelsnummer` INT NOT NULL,
  `Voornaam` VARCHAR(45) NOT NULL,
  `Tussenvoegsel` VARCHAR(45) NULL,
  `Achternaam` VARCHAR(45) NULL,
  PRIMARY KEY (`idMedewerker`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodCO2gether`.`LeaseAuto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GoodCO2gether`.`LeaseAuto` ;

CREATE TABLE IF NOT EXISTS `GoodCO2gether`.`LeaseAuto` (
  `idLeaseAuto` INT NOT NULL AUTO_INCREMENT,
  `Kenteken` VARCHAR(10) NULL,
  `Merk` VARCHAR(45) NULL,
  `Type` VARCHAR(45) NULL,
  `Model` VARCHAR(45) NULL,
  `VerbruikPerKilometer` FLOAT NULL,
  `IsHuidigeLeaseAuto` TINYINT NULL,
  `Medewerker_idMedewerker` INT NOT NULL,
  PRIMARY KEY (`idLeaseAuto`),
  INDEX `fk_LeaseAuto_Medewerker1_idx` (`Medewerker_idMedewerker` ASC) VISIBLE,
  CONSTRAINT `fk_LeaseAuto_Medewerker1`
    FOREIGN KEY (`Medewerker_idMedewerker`)
    REFERENCES `GoodCO2gether`.`Medewerker` (`idMedewerker`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodCO2gether`.`Locatie`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GoodCO2gether`.`Locatie` ;

CREATE TABLE IF NOT EXISTS `GoodCO2gether`.`Locatie` (
  `idLocatie` INT NOT NULL AUTO_INCREMENT,
  `Situatie` ENUM('Thuis', 'Klantlocatie', 'Goodzo HQ', 'Anders') NULL,
  `LocatieNaam` VARCHAR(45) NULL,
  `Plaats` VARCHAR(45) NULL,
  `Straat` VARCHAR(45) NULL,
  `Huisnummer` VARCHAR(10) NULL,
  `Latitude` FLOAT NULL,
  `Longitude` FLOAT NULL,
  `IsActieveKlantlocatie` TINYINT NULL,
  `Medewerker_idMedewerker` INT NOT NULL,
  PRIMARY KEY (`idLocatie`),
  INDEX `fk_KlantLocatie_Medewerker1_idx` (`Medewerker_idMedewerker` ASC) VISIBLE,
  CONSTRAINT `fk_KlantLocatie_Medewerker1`
    FOREIGN KEY (`Medewerker_idMedewerker`)
    REFERENCES `GoodCO2gether`.`Medewerker` (`idMedewerker`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodCO2gether`.`Werkdag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GoodCO2gether`.`Werkdag` ;

CREATE TABLE IF NOT EXISTS `GoodCO2gether`.`Werkdag` (
  `idWerkdag` INT NOT NULL AUTO_INCREMENT,
  `Datum` DATE NULL,
  `AantalBlikjesDrinkenOpHQ` INT NULL,
  `AantalBeeldschermen` INT NULL,
  `AantalUrenBeeldschermenAan` FLOAT NULL,
  `AantalVerzoekenAanChatGPT` INT NULL,
  `Medewerker_idMedewerker` INT NOT NULL,
  `BasisLocatie_idLocatie` INT NULL,
  PRIMARY KEY (`idWerkdag`),
  INDEX `fk_Werkdag_Medewerker1_idx` (`Medewerker_idMedewerker` ASC) VISIBLE,
  INDEX `fk_Werkdag_Locatie1_idx` (`BasisLocatie_idLocatie` ASC) VISIBLE,
  CONSTRAINT `fk_Werkdag_Medewerker1`
    FOREIGN KEY (`Medewerker_idMedewerker`)
    REFERENCES `GoodCO2gether`.`Medewerker` (`idMedewerker`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Werkdag_Locatie1`
    FOREIGN KEY (`BasisLocatie_idLocatie`)
    REFERENCES `GoodCO2gether`.`Locatie` (`idLocatie`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodCO2gether`.`Rit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GoodCO2gether`.`Rit` ;

CREATE TABLE IF NOT EXISTS `GoodCO2gether`.`Rit` (
  `idRit` INT NOT NULL AUTO_INCREMENT,
  `VanLatitude` FLOAT NULL,
  `VanLongitude` FLOAT NULL,
  `NaarLatitude` FLOAT NULL,
  `NaarLongitude` FLOAT NULL,
  `VanAdres` VARCHAR(100) NULL,
  `NaarAdres` VARCHAR(100) NULL,
  `AantalKilometers` FLOAT NOT NULL,
  `Werkdag_idWerkdag` INT NOT NULL,
  `Van` INT NULL,
  `Naar` INT NULL,
  INDEX `fk_Rit_Werkdag1_idx` (`Werkdag_idWerkdag` ASC) VISIBLE,
  INDEX `fk_Rit_WerkLocatie1_idx` (`Van` ASC) VISIBLE,
  INDEX `fk_Rit_WerkLocatie2_idx` (`Naar` ASC) VISIBLE,
  PRIMARY KEY (`idRit`),
  CONSTRAINT `fk_Rit_Werkdag1`
    FOREIGN KEY (`Werkdag_idWerkdag`)
    REFERENCES `GoodCO2gether`.`Werkdag` (`idWerkdag`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Rit_WerkLocatie1`
    FOREIGN KEY (`Van`)
    REFERENCES `GoodCO2gether`.`Locatie` (`idLocatie`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Rit_WerkLocatie2`
    FOREIGN KEY (`Naar`)
    REFERENCES `GoodCO2gether`.`Locatie` (`idLocatie`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodCO2gether`.`Tankbeurt`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `GoodCO2gether`.`Tankbeurt` ;

CREATE TABLE IF NOT EXISTS `GoodCO2gether`.`Tankbeurt` (
  `idTankbeurt` INT NOT NULL AUTO_INCREMENT,
  `Kosten` FLOAT NULL,
  `Kilometerstand` INT NULL,
  `Datum` DATE NULL,
  `LeaseAuto_idLeaseAuto` INT NOT NULL,
  PRIMARY KEY (`idTankbeurt`),
  INDEX `fk_Tankbeurt_LeaseAuto1_idx` (`LeaseAuto_idLeaseAuto` ASC) VISIBLE,
  CONSTRAINT `fk_Tankbeurt_LeaseAuto1`
    FOREIGN KEY (`LeaseAuto_idLeaseAuto`)
    REFERENCES `GoodCO2gether`.`LeaseAuto` (`idLeaseAuto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
