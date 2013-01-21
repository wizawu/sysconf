
#!/bin/bash

let n=8
declare -A arr

arr[0]="\e[0;33m\n
1. The fear of missing out.\n
If you feel anxious because you constantly feel\n
like you're missing out on something happening\n
somewhere else, you're not alone. We all feel this\n
way sometimes. But let me assure you, you could run\n
around trying to do everything, and travel around\n
the world, and always stay connected, and work and\n
party all night long without sleep, but you could\n
never do it all. You will always be missing\n
something. So let it go, and realize you have\n
everything right now. The best in life isn't\n
somewhere else; it's right where you are, at this\n
moment. Celebrate the perhaps not altogether\n
insignificant fact that you are alive right now.\n
This moment, and who you are, is absolutely perfect.\n
Take a deep breath, smile, and notice how lovely it\n
is. Read The Power of Now.\n
\e[0m"

arr[1]="\e[0;33m\n
2. Avoiding pain and defeat.\n
Not to spoil the ending for you, but everything is\n
going to be OK – you just need to learn a lesson or\n
two first. Don't run from the realities of the\n
present moment. The pain and defeat contained within\n
is necessary to your long-term growth. Remember,\n
there is a difference between encountering defeats\n
and being defeated. Nothing ever goes away until it\n
teaches you what you need to know, so you can move\n
on to the next step.\n
\e[0m"

arr[2]="\e[0;33m\n
3. Holding on to what's no longer there.\n
Some of us spend the vast majority of our lives\n
recounting past memories, and letting them steer the\n
course of the present. Don't waste your time trying\n
to live in another time and place. Let the past, go.\n
You must accept the end of something in order to\n
begin to build something new. So close some old\n
doors today. Not because of pride, inability or\n
egotism, but simply because you've entered each one\n
of them in the past and realize that they lead to\n
nowhere.\n
\e[0m"

arr[3]="\e[0;33m\n
4. Retelling a self-defeating story.\n
If we continue to repeat a story in our head, we\n
eventually believe that story and embrace it –\n
whether it empowers us or not. So the question is:\n
Does your story empower you? Don't place your\n
mistakes on your mind, their weight may crush your\n
current potential. Instead, place them under your\n
feet and use them as a platform to view the horizon.\n
Remember, all things are difficult before they are\n
easy. What matters the most is what you start doing\n
now. Read Awaken the Giant Within.\n
\e[0m"

arr[4]="\e[0;33m\n
5. Attempting to fit in by becoming someone else.\n
The hardest battle you're ever going to fight is the\n
battle to be you, just the way you are in this\n
moment. We cannot find ourselves if we are always\n
searching for, or morphing into, someone else. In\n
this crazy world that's trying to make you like\n
everyone else, find the courage to keep being your\n
awesome self. Be your own kind of beautiful right\n
now, in the way only you know how.\n
\e[0m"

arr[5]="\e[0;33m\n
6. The picture in your head of how it's supposed to be.\n
What often screws us up the most in life is the\n
picture in our head of how it's supposed to be.\n
Although every good thing has an end, in life every\n
ending is just a new beginning. Life goes on – not\n
always the way we had envisioned it would be, but\n
always the way it's supposed to be. Remember, we\n
usually can't choose the music life plays for us,\n
but we can choose how we dance to it. Read The Last\n
Lecture.\n
\e[0m"

arr[6]="\e[0;33m\n
7. Berating yourself for not being perfect.\n
Don't be too hard on yourself. There are plenty of\n
people willing to do that for you. Do your best and\n
surrender the rest. Tell yourself, \"I am doing the\n
best I can with what I have in this moment. And that\n
is all I can expect of anyone, including me.\" Love\n
yourself and be proud of everything that you do,\n
even your mistakes. Because even mistakes mean\n
you're trying.\n
\e[0m"

arr[7]="\e[0;33m\n
8. Waiting, and then waiting some more.\n
Stop waiting for tomorrow; you will never get today\n
back. It doesn't matter what you've done in the\n
past. It doesn't matter how low or unworthy you feel\n
right now. The simple fact that you're alive makes\n
you worthy. Life is too short for excuses. Stop\n
settling. Stop procrastinating. Start today by\n
taking one courageous step forward. If you are not\n
sure exactly which way to go, it is always wise to\n
follow your heart.\n
\e[0m"

let now=`date +"%s"`
let rem=$now%$n

echo -e ${arr[$rem]}

