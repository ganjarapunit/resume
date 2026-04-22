import asyncio
import edge_tts
import os

VOICE = "en-US-AvaMultilingualNeural"

async def generate_audio(text, filename):
    communicate = edge_tts.Communicate(text, VOICE, rate="+3%", pitch="+2Hz") # Slightly slower for a more natural, thoughtful discussion
    await communicate.save(filename)
    print(f"Generated: {filename}")

async def main():
    assets_dir = r"C:\Users\Punit\.gemini\antigravity\scratch\ielts_course\assets"
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)
    
    # Part 1 Model Answer (~1 minute)
    part1_text = (
        "Well, I'd like to tell you a bit about my hometown. I live in a vibrant, coastal city that is really a mix of two worlds. "
        "On one hand, we have these ancient, narrow streets filled with historical architecture that dates back several centuries. "
        "On the other hand, there is this incredibly modern skyline with glass skyscrapers that light up beautifully at night. "
        "What I love most about living there is the convenience. Everything is within walking distance, from bustling local markets "
        "where you can find fresh produce every morning, to quiet, hidden cafes where I often spend my weekends reading. "
        "The people are also incredibly warm and welcoming, which creates a real sense of community. "
        "Recently, I've started spending more time at the newly developed waterfront park. It's a great place to jog or just sit "
        "and watch the sunset after a long day of work. It’s that balance of urban energy and natural beauty that makes it "
        "such a special place for me to call home."
    )
    
    # Part 2 Model Answer (~2 minutes)
    part2_text = (
        "I'd like to talk about a piece of technology that I find absolutely indispensable in my daily life, and that is my smartwatch. "
        "I actually received this as a graduation gift from my parents about a year ago, and to be honest, I didn't realize just how much "
        "it would change my routine until I started wearing it every single day. "
        "The watch itself is quite sleek, with a minimalist black band and a customizable digital face. But what really matters is "
        "what it can do. Primarily, it functions as a comprehensive health tracker. It monitors my heart rate, tracks my steps, "
        "and even analyzes my sleep patterns. For someone like me who tries to maintain a healthy lifestyle while balancing a "
        "busy work schedule, having that data at my fingertips is incredibly motivating. "
        "Beyond fitness, it’s a powerful organizational tool. It syncs perfectly with my phone, so I can see my calendar appointments "
        "and receive notifications without having to constantly reach for my device. This has actually helped me become less distracted "
        "by my phone, as I only look at the watch for urgent alerts. "
        "One specific reason why I find it so useful is the GPS feature. I'm an avid runner, and being able to track my routes "
        "and pace without carrying a heavy phone is a total game-changer. It gives me a sense of freedom when I'm outdoors. "
        "Overall, this smartwatch isn't just a gadget to me; it's like a personal assistant on my wrist. It helps me stay disciplined "
        "with my health goals and keeps me on track with my professional responsibilities. I think in today's fast-paced world, "
        "having technology that simplifies your life rather than complicating it is truly valuable, and that's exactly what this watch does for me."
    )

    # Part 3 Model Answer 1 (Impact of Tech) - Expanded for ~4 minutes
    part3_text_1 = (
        "That's a fascinating question. In my view, the impact of technology on communication, especially across different generations, "
        "is a double-edged sword. To start with, we have to acknowledge the incredible democratization of communication. "
        "In the past, keeping in touch with relatives who lived in another country was an expensive and time-consuming process involving "
        "international letters or incredibly costly long-distance phone calls. Today, we have high-definition video conferencing and instant "
        "messaging that allow for real-time connection. This has, in many ways, bridged the physical gap between families. "
        "However, there's another side to this story. While we are more 'connected' than ever, there’s a growing concern that the "
        "quality of our communication is actually declining. We see younger generations who are incredibly adept at digital communication "
        "but may struggle with the nuances of face-to-face interaction—things like reading body language, maintaining eye contact, or "
        "navigating complex emotional subtext. This can lead to a sense of isolation even when we are constantly interacting online. "
        "Furthermore, we must consider the 'digital divide' that often separates younger people from their older relatives. "
        "While many seniors have embraced technology, there is still a significant portion of the elderly population that feels "
        "alienated by the rapid pace of technological change. This can inadvertently lead to social exclusion, where the very tools "
        "meant to bring us together end up creating a barrier between those who are tech-savvy and those who are not. "
        "Another critical aspect is the issue of privacy and the boundaries of communication. In the digital age, the line between "
        "public and private life has become increasingly blurred. We often share intimate details of our lives on social media platforms, "
        "which can lead to a loss of genuine personal connection in favor of a curated, artificial image of ourselves. "
        "This obsession with 'likes' and digital validation can deeply affect our self-esteem and the way we value real-world relationships. "
        "In conclusion, while technology has provided us with unprecedented tools for staying in touch, it has also introduced "
        "complex social challenges that we are still learning to navigate. The key, I believe, lies in using technology as a supplement "
        "to, rather than a replacement for, the authentic, deep-seated human connections that can only be built through presence and "
        "undivided attention."
    )

    # Part 3 Model Answer 2 (AI in Education) - Expanded for ~4 minutes
    part3_text_2 = (
        "The question of whether artificial intelligence will eventually replace human teachers is one of the most debated topics "
        "in modern education. To address this, we first need to look at what AI is exceptionally good at. AI systems are unrivaled "
        "when it comes to data processing and personalization. They can analyze a student's learning patterns in real-time, "
        "identifying specific gaps in knowledge and providing tailored exercises that adapt to the student's pace. "
        "This level of individualization is almost impossible for a human teacher to achieve in a classroom of thirty or forty students. "
        "AI can provide instant feedback, handle repetitive grading tasks, and offer access to a vast, global library of information. "
        "However, and this is a crucial 'however,' education is far more than just the transfer of data or the mastery of a curriculum. "
        "Education is a profoundly social and emotional process. A human teacher provides mentorship, inspiration, and emotional support—"
        "things that an algorithm, no matter how sophisticated, simply cannot replicate. A teacher can sense when a student is "
        "feeling discouraged, can offer a word of encouragement that changes a student's entire outlook, and can model ethical "
        "decision-making and empathy. These 'soft skills' are the cornerstone of a holistic education. "
        "Furthermore, teachers play a vital role in fostering critical thinking and collaborative problem-solving. While AI can "
        "provide answers, a teacher guides the student through the process of asking the right questions, challenging assumptions, "
        "and engaging in meaningful debate with their peers. The classroom is a laboratory for social interaction, and the teacher "
        "is the facilitator who helps students navigate the complexities of human relationships and social responsibility. "
        "Looking toward the future, I don't see AI as a replacement for teachers, but rather as a powerful 'co-pilot.' "
        "By automating administrative tasks and providing deep insights into student progress, AI can actually free up teachers "
        "to do what they do best: focus on the individual needs of their students, provide mentorship, and foster a love of learning. "
        "The most effective educational systems of the future will be those that successfully integrate the efficiency and "
        "analytical power of AI with the irreplaceable warmth, intuition, and inspiration of human educators. "
        "It's about synergy, not substitution. We should embrace AI as a tool that empowers teachers to be more effective, "
        "rather than a threat that aims to remove the human heart from the center of the educational experience."
    )

    await generate_audio(part1_text, os.path.join(assets_dir, "part1_model.mp3"))
    await generate_audio(part2_text, os.path.join(assets_dir, "part2_model.mp3"))
    await generate_audio(part3_text_1, os.path.join(assets_dir, "part3_model_1.mp3"))
    await generate_audio(part3_text_2, os.path.join(assets_dir, "part3_model_2.mp3"))

if __name__ == "__main__":
    asyncio.run(main())
