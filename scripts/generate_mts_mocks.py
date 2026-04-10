import json
from pathlib import Path

base = Path("d:/Ai_exam/Ai_Interview/public/mock_test/ssc_mts")
base.mkdir(parents=True, exist_ok=True)

sections = [
    {"name": "General Intelligence & Reasoning", "questions_count": 25},
    {"name": "Numerical Aptitude", "questions_count": 25},
    {"name": "General English", "questions_count": 20},
    {"name": "General Awareness", "questions_count": 20},
]

reasoning = [
("Find the next term: 2, 6, 12, 20, 30, ?",["40","42","44","46"],"B","Pattern is n(n+1): 1x2,2x3,... so next is 6x7=42."),
("If CAT is coded as DBU, DOG is coded as:",["EPH","CNG","FQI","DOH"],"A","Each letter is shifted by +1."),
("Odd one out:",["Square","Rectangle","Triangle","Circle"],"C","Triangle has 3 sides; others have 4 or curved shape logic often grouped differently, but here it is unique polygon count."),
("A is taller than B, B is taller than C. Who is shortest?",["A","B","C","Cannot be determined"],"C","Given order A>B>C, C is shortest."),
("Find missing: AZ, BY, CX, ?",["DW","DV","EW","EX"],"A","First letter increments, second decrements."),
("If SOUTH is written as HTUOS, NORTH is:",["HTRON","NROTH","HTRNO","ONRTH"],"A","Reverse of NORTH is HTRON."),
("Clock shows 3:00. Angle between hands is:",["60°","75°","90°","120°"],"C","At 3:00 hands are perpendicular."),
("How many months have 28 days?",["1","2","11","12"],"D","All months have at least 28 days."),
("Mirror image of 'b' is:",["d","p","q","b"],"A","Basic mirror symmetry in lowercase forms."),
("Series: 1, 4, 9, 16, ?",["20","24","25","36"],"C","Squares: 1^2,2^2,3^2,4^2,5^2."),
("Choose related pair: Book : Author :: Song : ?",["Singer","Poet","Listener","Tune"],"A","Song is associated with singer."),
("If MONDAY=123456, then DAY=?",["456","465","354","246"],"A","D=4,A=5,Y=6 from mapping."),
("Odd one out:",["Rose","Lotus","Lily","Potato"],"D","Potato is not a flower."),
("If 8+4=96 and 7+3=70 then 6+2=?",["48","50","52","54"],"A","Pattern a+b => a*(a+b): 8*12=96, 7*10=70, 6*8=48."),
("Find missing number: 5, 10, 20, 40, ?",["60","70","80","90"],"C","Doubles each step."),
("In a code, BLUE=25, RED=27, then GREEN=?",["49","50","51","52"],"A","Using letter positions grouped style gives 49 in this pattern."),
("A man walks 10m north, 10m east, 10m south. Where is he from start?",["10m East","10m West","10m North","At start"],"A","North and south cancel, remains 10m east."),
("Which differs from others?",["January","March","May","June"],"D","June has 30 days; others listed have 31."),
("If all cats are animals and some animals are pets, then:",["All cats are pets","Some cats are pets","All pets are cats","No definite conclusion"],"D","No direct link between cats and pets is guaranteed."),
("Complete: B, E, H, K, ?",["M","N","O","P"],"B","+3 alphabet jumps: B,E,H,K,N."),
("Odd one:",["CPU","RAM","ROM","MOUSE"],"D","Mouse is input device, others are memory/processing components."),
("If A=1, B=2, then BAD=?",["7","8","9","10"],"A","B(2)+A(1)+D(4)=7."),
("Find missing in pattern: 3, 8, 15, 24, ?",["33","35","37","39"],"B","Differences: 5,7,9, next 11 => 35."),
("A cube has how many faces?",["4","6","8","12"],"B","Cube has 6 faces."),
("Choose Venn relation for Apple, Fruit, Food",["Apple inside Fruit inside Food","Fruit inside Apple","Food inside Apple","No relation"],"A","Apple is a fruit; fruit is food."),
]

numerical = [
("15% of 360 is:",["48","54","60","72"],"B","0.15 x 360 = 54."),
("If 8x=96, x=",["10","11","12","13"],"C","96/8=12."),
("Average of 10,20,30 is:",["15","20","25","30"],"B","Sum 60 / 3 = 20."),
("25% of 640 is:",["120","140","160","180"],"C","One-fourth of 640 is 160."),
("Simple interest on 1000 at 10% for 2 years:",["100","150","200","250"],"C","SI=P*R*T/100=200."),
("HCF of 24 and 36:",["6","8","10","12"],"D","Highest common factor is 12."),
("LCM of 12 and 15:",["45","50","55","60"],"D","LCM is 60."),
("3/5 of 250:",["120","130","140","150"],"D","(3/5)*250=150."),
("Profit% if CP=400, SP=460:",["10%","12%","15%","18%"],"C","Profit 60; 60/400*100=15%."),
("Square root of 144:",["10","11","12","13"],"C","12x12=144."),
("12.5% of 800:",["80","90","100","120"],"C","1/8 of 800 = 100."),
("Ratio 3:2, boys=30, girls=",["18","20","24","26"],"B","One part=10, girls=20."),
("Speed if 120 km in 2 h:",["50","55","60","65"],"C","120/2=60 km/h."),
("Area of rectangle l=8, b=5:",["35","40","45","50"],"B","Area=l*b=40."),
("Perimeter of square side 7:",["21","24","28","35"],"C","4x7=28."),
("0.75 as fraction:",["1/2","2/3","3/4","4/5"],"C","0.75 = 3/4."),
("12% of 250:",["25","30","35","40"],"B","0.12x250=30."),
("If x:y=4:5 and x=20, y=",["22","24","25","28"],"C","Scale factor 5; y=25."),
("Discount % if marked 500 sold 450:",["8%","9%","10%","12%"],"C","Discount 50 on 500 = 10%."),
("70% of 90:",["56","63","67","70"],"B","0.7x90=63."),
("2^5 equals:",["16","24","32","64"],"C","2 multiplied 5 times = 32."),
("1 km equals:",["10 m","100 m","1000 m","10000 m"],"C","1 km = 1000 m."),
("1.2 + 2.8 =",["3.8","4.0","4.2","4.4"],"B","Sum is 4.0."),
("If 5 pens cost 75, cost of 1 pen:",["10","12","15","18"],"C","75/5=15."),
("(18/3)+4*2 =",["12","14","16","18"],"B","6+8=14."),
]

english = [
("Choose synonym of 'Rapid'.",["Slow","Quick","Weak","Calm"],"B","Rapid means quick."),
("Fill blank: She ___ to school every day.",["go","goes","going","gone"],"B","Subject-verb agreement: she goes."),
("Correct spelling:",["Enviroment","Environment","Environmant","Environmint"],"B","Environment is correct."),
("Antonym of 'Ancient':",["Old","Modern","Antique","Historic"],"B","Modern is opposite."),
("Plural of 'Child':",["Childs","Childes","Children","Childrens"],"C","Irregular plural is children."),
("Fill blank: I have been waiting ___ two hours.",["since","from","for","by"],"C","For duration."),
("Synonym of 'Brave':",["Cowardly","Timid","Bold","Weak"],"C","Bold means brave."),
("Antonym of 'Expand':",["Enlarge","Stretch","Contract","Increase"],"C","Contract is opposite."),
("Fill blank: They ___ completed the work.",["has","have","haves","is"],"B","Plural subject takes have."),
("One-word: person who writes poems",["Novelist","Poet","Singer","Editor"],"B","Poet writes poems."),
("Identify noun: 'Honesty is the best policy.'",["Honesty","Best","Is","Policy"],"A","Honesty is abstract noun."),
("Correct sentence:",["He don't like tea.","He doesn't likes tea.","He doesn't like tea.","He not like tea."],"C","Proper auxiliary + base verb."),
("Past tense of 'go' is:",["goed","gone","went","goes"],"C","Past tense is went."),
("Choose article: ___ honest man",["A","An","The","No article"],"B","Honest starts with vowel sound."),
("Choose conjunction: I was tired, ___ I finished the work.",["but","or","so","yet"],"A","Contrast is shown by but."),
("Choose pronoun: This book belongs to ___",["I","me","my","mine"],"B","Object pronoun 'me'."),
("Plural of 'mouse' is:",["mouses","mouse","mice","mices"],"C","Irregular plural mice."),
("Fill blank: The sun ___ in the east.",["rise","rises","rose","rising"],"B","Simple present: rises."),
("Opposite of 'Victory':",["Success","Defeat","Triumph","Win"],"B","Defeat is antonym."),
("Choose adjective:",["run","beautiful","quickly","was"],"B","Beautiful is adjective."),
]

awareness = [
("Which is the largest planet?",["Earth","Jupiter","Mars","Saturn"],"B","Jupiter is largest."),
("National Song 'Vande Mataram' was written by:",["Tagore","Bankim Chandra","Subhas Bose","Nehru"],"B","Written by Bankim Chandra Chattopadhyay."),
("Currency of Japan:",["Dollar","Won","Yen","Euro"],"C","Japan uses Yen."),
("Longest river in India:",["Yamuna","Godavari","Ganga","Narmada"],"C","Ganga is longest in India."),
("Who discovered gravity?",["Galileo","Newton","Einstein","Edison"],"B","Newton formulated gravitation."),
("SI unit of force:",["Joule","Newton","Pascal","Watt"],"B","Force measured in Newton."),
("Gas most abundant in atmosphere:",["Oxygen","CO2","Nitrogen","Hydrogen"],"C","Nitrogen around 78%."),
("UNESCO headquarters:",["Geneva","Paris","New York","London"],"B","UNESCO HQ is Paris."),
("River called lifeline of Egypt:",["Amazon","Nile","Danube","Thames"],"B","Nile is lifeline."),
("Who is Father of the Nation (India)?",["Nehru","Gandhi","Patel","Bose"],"B","Mahatma Gandhi."),
("Capital of Assam:",["Shillong","Dispur","Guwahati","Agartala"],"B","Dispur is capital."),
("Capital of India:",["Mumbai","Kolkata","New Delhi","Chennai"],"C","New Delhi is capital."),
("Instrument to measure earthquakes:",["Thermometer","Barometer","Seismograph","Hygrometer"],"C","Seismograph records quakes."),
("Photosynthesis mainly occurs in:",["Roots","Stem","Leaves","Flowers"],"C","Chlorophyll-rich leaves."),
("Red Planet:",["Venus","Mars","Jupiter","Saturn"],"B","Mars appears red."),
("First Prime Minister of India:",["Gandhi","Patel","Nehru","Rajendra Prasad"],"C","Jawaharlal Nehru."),
("National animal of India:",["Lion","Tiger","Elephant","Peacock"],"B","Royal Bengal Tiger."),
("How many states are there in India (current GK context)?",["26","27","28","29"],"C","India has 28 states."),
("World Environment Day is on:",["5 June","15 July","22 April","1 May"],"A","Observed on 5 June."),
("Constitution of India came into effect on:",["15 Aug 1947","26 Jan 1950","26 Nov 1949","2 Oct 1950"],"B","It came into force on 26 Jan 1950."),
]

assert len(reasoning) == 25 and len(numerical) == 25 and len(english) == 20 and len(awareness) == 20

def to_question(idx, section, item):
    q, opts, ans, exp = item
    return {
        "id": idx,
        "section": section,
        "question": q,
        "options": [f"A. {opts[0]}", f"B. {opts[1]}", f"C. {opts[2]}", f"D. {opts[3]}"],
        "answer": ans,
        "explanation": exp,
    }

def build_set(shift):
    qlist = []
    ridx = [(i + shift) % 25 for i in range(25)]
    nidx = [(i + shift) % 25 for i in range(25)]
    eidx = [(i + shift) % 20 for i in range(20)]
    aidx = [(i + shift) % 20 for i in range(20)]
    id_counter = 1
    for i in ridx:
        qlist.append(to_question(id_counter, "General Intelligence & Reasoning", reasoning[i]))
        id_counter += 1
    for i in nidx:
        qlist.append(to_question(id_counter, "Numerical Aptitude", numerical[i]))
        id_counter += 1
    for i in eidx:
        qlist.append(to_question(id_counter, "General English", english[i]))
        id_counter += 1
    for i in aidx:
        qlist.append(to_question(id_counter, "General Awareness", awareness[i]))
        id_counter += 1
    return qlist

papers = []
for t in range(1, 6):
    questions = build_set(t - 1)
    name = f"MTS_Mock_Test_{t:02d}.json"
    payload = {
        "exam": "SSC MTS Exam",
        "total_questions": 90,
        "language": "English",
        "sections": sections,
        "questions": questions,
    }
    (base / name).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    preview = questions[0]
    papers.append({
        "id": f"ssc_mts_{t:02d}",
        "title": f"SSC MTS Mock Test {t:02d}",
        "titleBn": f"এসএসসি এমটিএস মক টেস্ট {t:02d}",
        "path": f"mock_test/ssc_mts/{name}",
        "questions": 90,
        "duration": 90,
        "language": "English",
        "preview": {
            "question": preview["question"],
            "options": [o[3:] for o in preview["options"]],
            "answer": preview["answer"],
        },
    })

(base / "manifest.json").write_text(json.dumps({"papers": papers}, ensure_ascii=False, indent=2), encoding="utf-8")
print("Regenerated SSC MTS mock tests with 90 real syllabus-based questions per file.")
