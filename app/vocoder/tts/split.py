#!/usr/bin/python

import os

splitter="ffmpeg -y"

src_dir="~/ulm/ziv/medapp-patient/speech_src/"

infiles_male=[
	"wellnessQueryWithAnswersMALE.mp3",
	"diarrhoeQueryWithAnswersMALE.mp3",
	"vomitQueryWithAnswersMALE.mp3",
	"painQueryWithAnswersMALE.mp3",
	"mucoQueryWithAnswersMALE.mp3",
	"nauseaQueryWithAnswersMALE.mp3",
	"pnpQueryWithAnswersMALE.mp3",
	"movementQueryWithAnswersMALE.mp3",
	"medicationQueryWithAnswersMALE.mp3",
	"breathQueryWithAnswersMALE.mp3",
	"eczemaQueryWithAnswersMALE.mp3",
	"exerciseQueryWithAnswersMALE.mp3",
	"fatigueQueryWithAnswersMALE.mp3",
	"jointQueryWithAnswersMALE.mp3",
	"liverQueryWithAnswersMALE.mp3",
	"muscleQueryWithAnswersMALE.mp3",
	"visionQueryWithAnswersMALE.mp3",
	"hypertensionQueryWithAnswersMALE.mp3"
]

infiles_female=[
	"wellnessQueryWithAnswersFEMALE.mp3",
	"diarrhoeQueryWithAnswersFEMALE.mp3",
	"vomitQueryWithAnswersFEMALE.mp3",
	"painQueryWithAnswersFEMALE.mp3",
	"mucoQueryWithAnswersFEMALE.mp3",
	"nauseaQueryWithAnswersFEMALE.mp3",
	"pnpQueryWithAnswersFEMALE.mp3",
	"movementQueryWithAnswersFEMALE.mp3",
	"medicationQueryWithAnswersFEMALE.mp3",
	"breathQueryWithAnswersFEMALE.mp3",
	"eczemaQueryWithAnswersFEMALE.mp3",
	"exerciseQueryWithAnswersFEMALE.mp3",
	"fatigueQueryWithAnswersFEMALE.mp3",
	"jointQueryWithAnswersFEMALE.mp3",
	"liverQueryWithAnswersFEMALE.mp3",
	"muscleQueryWithAnswersFEMALE.mp3",
	"visionQueryWithAnswersFEMALE.mp3",
	"hypertensionQueryWithAnswersFEMALE.mp3"
]

# times for split in seconds
times_male=[
	[1.9, 2.9, 3.60, 4.600, 5.180 ],	# wellness
	[5.000, 6.0, 7.5, 9.185, 10.0],	# diarrhoe
	[3.3, 4.3, 6.0, 7.5, 8.3 ],	# vomit
	[1.734, 2.523, 3.436, 4.434, 5.1 ],	# pain
	[3.708, 5.144, 9.0, 12.784, 13.458],	# muco
	[2.576, 4.575, 7.8, 9.540, 10.2 ],	# nausea
	[2.405, 3.181, 5.0, 7.530, 8.212],	# pnp
	[2.478, 5.320, 6.0],	# movement
	[3.516, 5.7, 6.7],	# medication
	[2.0, 2.7, 3.3], # breath
	[4.6, 5.3, 5.9],	# eczema
	[3, 3.5, 4.2],	# exercise
	[1.9, 2.5, 5.4, 8.5, 9.2],	# fatigue
	[1.9, 2.6, 3.2],	# joint
	[1.6, 2.4,2.95 ],	# liver
	[2.0, 2.6, 3.2],	# muscle
	[2.1, 2.9, 3.4],	# vision
	[2.1, 4.5, 10 , 15.9, 16.5],	#hypertension
]

# slightly differing times in some cases
times_female=[
	[1.9, 3.000, 3.650, 4.600, 5.3 ],	# wellness
	[5.000, 6.1, 7.7, 9.5, 10.4],	# diarrhoe
	[3.3, 4.4, 6.1, 7.8, 8.6 ],	# vomit
	[1.734, 2.6, 3.7, 4.7, 5.5 ],	# pain
	[3.708, 5.3, 9.0, 13.2, 13.9],	# muco
	[2.576, 4.8, 8.1, 10.3, 11 ],	# nausea
	[2.7, 3.5, 5.5, 8, 8.9],	# pnp
	[2.8, 5.6, 6.4],	# movement
	[3.9, 6.5, 7.3],	# medication
	[2.0, 2.8, 3.5], # breath
	[4.6, 5.5, 6.2],	# eczema
	[3, 3.8, 4.6],	# exercise
	[1.9, 2.7, 5.7, 8.9, 9.7],	# fatigue
	[2.0, 2.8, 3.4],	# joint
	[1.6, 2.4, 3.05 ],	# liver
	[2.2, 2.9, 3.6],	# muscle
	[2.2, 3.0, 3.7],	# vision
	[2.1, 4.7, 10.6 , 17, 17.5],	#hypertension
]

names=["wellness","diarrhoe","vomit","pain","muco","nausea","pnp","movement","medication",
	"breath","eczema","exercise","fatigue","joint","liver","muscle","vision","hypertension"]

descr=["question","answer_1","answer_2","answer_3","answer_or","answer_4"]

def create_files(files,sex,times) :
	for i in range(0,len(files)) :
		if i!=11 and i!=12 and i!=14 and i!=8 and i!=16 :
			continue
		print(files[i])
		for ti in range(0,1+len(times[i])) :
			if ti==0 :
				ts=0
				te=times[i][0]
			else :
				if ti==len(times[i]) :	
					ts=times[i][ti-1]
					te=None
				else :
					ts=times[i][ti-1]
					te=times[i][ti]
			ofname=names[i]+"_"+sex+"_"
			if len(times[i])==3 and ti>=2 :
				if ti==2 :
					ofname+="answer_or"
				if ti==3 :
					ofname+="answer_2"
			else :
				ofname+=descr[ti]
			ofname+=".mp3"
#			print "ti=",ti
#			print ofname
#			print ts," - ", te
			cmd=splitter+" -ss "+str(ts)+" -i "+src_dir+files[i]
			if te :
				cmd+=" -t "+str(te-ts)
			cmd+=" -c:a copy "+ofname
			cmd+=" 2>/dev/null"
#			print cmd
			os.system(cmd)		
			# print out names
			print "	\""+ofname+"\","
# main
create_files(infiles_male,"male",times_male)
create_files(infiles_female,"female",times_female)
