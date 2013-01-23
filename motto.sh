
#!/bin/bash

let n=9
declare -A arr

arr[0]="\e[0;35m\n
1. The fear of missing out.\n
If you feel anxious because you constantly feel like\n
you're missing out on something happening somewhere\n
else, you're not alone. We all feel this way sometimes.\n
But let me assure you, you could run around trying to\n
do everything, and travel around the world, and always\n
stay connected, and work and party all night long\n
without sleep, but you could never do it all. You will\n
always be missing something. So let it go, and realize\n
you have everything right now. The best in life isn't\n
somewhere else; it's right where you are, at this\n
moment. Celebrate the perhaps not altogether\n
insignificant fact that you are alive right now. This\n
moment, and who you are, is absolutely perfect. Take a\n
deep breath, smile, and notice how lovely it is. Read\n
The Power of Now.\n
\e[0m"

arr[1]="\e[0;35m\n
2. Avoiding pain and defeat.\n
Not to spoil the ending for you, but everything is\n
going to be OK – you just need to learn a lesson or two\n
first. Don't run from the realities of the present\n
moment. The pain and defeat contained within is\n
necessary to your long-term growth. Remember, there is\n
a difference between encountering defeats and being\n
defeated. Nothing ever goes away until it teaches you\n
what you need to know, so you can move on to the next\n
step.\n
\e[0m"

arr[2]="\e[0;35m\n
3. Holding on to what's no longer there.\n
Some of us spend the vast majority of our lives\n
recounting past memories, and letting them steer the\n
course of the present. Don't waste your time trying to\n
live in another time and place. Let the past, go. You\n
must accept the end of something in order to begin to\n
build something new. So close some old doors today. Not\n
because of pride, inability or egotism, but simply\n
because you've entered each one of them in the past and\n
realize that they lead to nowhere.\n
\e[0m"

arr[3]="\e[0;35m\n
4. Retelling a self-defeating story.\n
If we continue to repeat a story in our head, we\n
eventually believe that story and embrace it – whether\n
it empowers us or not. So the question is: Does your\n
story empower you? Don't place your mistakes on your\n
mind, their weight may crush your current potential.\n
Instead, place them under your feet and use them as a\n
platform to view the horizon. Remember, all things are\n
difficult before they are easy. What matters the most\n
is what you start doing now. Read Awaken the Giant\n
Within.\n
\e[0m"

arr[4]="\e[0;35m\n
5. Attempting to fit in by becoming someone else.\n
The hardest battle you're ever going to fight is the\n
battle to be you, just the way you are in this moment.\n
We cannot find ourselves if we are always searching\n
for, or morphing into, someone else. In this crazy\n
world that's trying to make you like everyone else,\n
find the courage to keep being your awesome self. Be\n
your own kind of beautiful right now, in the way only\n
you know how.\n
\e[0m"

arr[5]="\e[0;35m\n
6. The picture in your head of how it's supposed to be.\n
What often screws us up the most in life is the picture\n
in our head of how it's supposed to be. Although every\n
good thing has an end, in life every ending is just a\n
new beginning. Life goes on – not always the way we had\n
envisioned it would be, but always the way it's\n
supposed to be. Remember, we usually can't choose the\n
music life plays for us, but we can choose how we dance\n
to it. Read The Last Lecture.\n
\e[0m"

arr[6]="\e[0;35m\n
7. Berating yourself for not being perfect.\n
Don't be too hard on yourself. There are plenty of\n
people willing to do that for you. Do your best and\n
surrender the rest. Tell yourself, \"I am doing the\n
best I can with what I have in this moment. And that is\n
all I can expect of anyone, including me.\" Love\n
yourself and be proud of everything that you do, even\n
your mistakes. Because even mistakes mean you're trying.\n
\e[0m"

arr[7]="\e[0;35m\n
8. Waiting, and then waiting some more.\n
Stop waiting for tomorrow; you will never get today\n
back. It doesn't matter what you've done in the past.\n
It doesn't matter how low or unworthy you feel right\n
now. The simple fact that you're alive makes you\n
worthy. Life is too short for excuses. Stop settling.\n
Stop procrastinating. Start today by taking one\n
courageous step forward. If you are not sure exactly\n
which way to go, it is always wise to follow your heart.\n
\e[0m"

arr[8]="\n
\e[0;34m Confidence comes from practice, not knowledge.\n
\e[0;35m Do a little bit more than you are comfortable doing.\n
\e[0;36m Mistakes are what make practice valuable.\n
\e[0m"

let now=`date +"%s"`
let rem=$now%$n

echo -e ${arr[$rem]}

