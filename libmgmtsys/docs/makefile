SRS_PATH = srs.md
SRA_PATH = sra.md
SA_PATH = sa.md
SD_PATH = sd.md
TP_PATH = tp.md
SR_PATH = sr.md
SRS_PDF_PATH = pdf/SRS\ Group\ 14.pdf
SRA_PDF_PATH = pdf/SRA\ Group\ 14.pdf
SA_PDF_PATH = pdf/SA\ Group\ 14.pdf
SD_PDF_PATH = pdf/SD\ Group\ 14.pdf
TP_PDF_PATH = pdf/TP\ Group\ 14.pdf
SR_PDF_PATH = pdf/SR\ Group\ 14.pdf

create_sr: ${SR_PATH}
	pandoc ${SR_PATH} -o ${SR_PDF_PATH}

all: create_sr create_srs create_sra create_sa create_sd create_tp

create_tp: ${TP_PATH}
	pandoc ${TP_PATH} --highlight-style pygments -o ${TP_PDF_PATH}

create_srs: ${SRS_PATH}
	pandoc ${SRS_PATH} -o ${SRS_PDF_PATH}

create_sra: ${SRA_PATH}
	pandoc ${SRA_PATH} -o ${SRA_PDF_PATH}

create_sa: ${SA_PATH}
	pandoc ${SA_PATH} -o ${SA_PDF_PATH}

create_sd: ${SD_PATH}
	pandoc ${SD_PATH} --highlight-style pygments -o ${SD_PDF_PATH}

clean:
	rm -f $(SRS_PDF_PATH)
	rm -f $(SRA_PDF_PATH)
	rm -f $(SA_PDF_PATH)
	rm -f $(SD_PDF_PATH)
	rm -f $(TP_PDF_PATH)