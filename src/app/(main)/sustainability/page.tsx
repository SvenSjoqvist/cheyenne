export default function SustainabilityPage() {
    return (
        <div className="min-h-screen bg-neutral-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center font-[bero] mb-6 md:mb-10">
                    Sustainability
                </h1>
                <div className="max-w-3xl mx-auto mb-16 md:mb-24">
                    <h2 className="text-base md:text-lg lg:text-xl font-medium text-center font-darker-grotesque">
                        Our approach to sustainability is rooted in transparency and intention. Learn more about the materials, methods, and choices behind the production.
                    </h2>
                </div>

                <div className="space-y-16 md:space-y-24">
                    {[
                        {
                            title: "Intentional by design.",
                            content: "At Kilaeko, sustainability begins with how much we choose not to produce. Every collection is made in limited quantities, with no restocks. This is a purposeful choice that keeps our production process intentional, ensuring quality is met on every single level with every garment. It's how we avoid overproduction, reduce waste, and keep our process aligned with our values. We encourages our community to shop with mindfulness, valuing a conscious shopping experience."
                        },
                        {
                            title: "Slow made in <br/>Bali, Indonesia.",
                            content: "Our pieces are produced and manufactured in Bali, Indonesia, in close collaboration with an artisan team. We consistently maintain direct communication so we can be a part of the process from start to finish. Production goes beyond the borders—while we're based in the U.S., we've built a strong partnership with a small team abroad, working together to bring each design to life with intention and care based on shared values. By working closely with our partners, we support a more mindful atmosphere of ethics and transparency that centers people over profit."
                        },
                        {
                            title: "A mindful production <br />process.",
                            content: "Each collection begins with a clear intention. We release only what's necessary, with no plans for repeats. This creates space for more thoughtful consumption and encourages a lasting connection to each garment. When we create, it's with purpose, and every piece carries intention. This concept we embarked on challenges the idea that more is better. We are driven to make each collection count by doing less. It's our way of building a slower, more conscious brand—one that grows with our community and is representative of human experiences—a core value where each piece reflects on memories. It's a reminder that, like you, some things in life are ingrained and stay with you forever. Our swimwear is crafted to embody exactly that—a one-of-a-kind moment."
                        },
                        {
                            title: "Designs that last.",
                            content: "Sustainability at its center is rooted in longevity. Our pieces are designed to live beyond a single season, true to a timeless nature. With a focus on function, it's important to us that our swimwear continues to serve you well beyond the moment. Every decision, from cut to construction, is made with durability in mind. We choose materials and finishes that support repeated wear, wash, and movement. Because the most sustainable wardrobe is one built on things you don't have to replace. These are pieces meant to stay with you—evolving through time, not discarded because time passed."
                        },
                        {
                            title: "Our commitment <br />to do less.",
                            content: "We reduce our impact by addressing the core foundation from the get go: quantity. By being selective about what we create and how much of it is produced, we avoid excess from the very beginning. Following this model allows us to minimize waste and the footprint that comes with large-scale manufacturing. Each piece follows clear practices, shaped through a close and personal partnership with our Bali-based team. By doing less, we make room for better decisions, leading us to pour more into each design."
                        }
                    ].map((section, index) => (
                        <div 
                            key={index}
                            className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 lg:gap-20"
                        >
                            <h3 
                                className="text-2xl md:text-3xl font-medium font-darker-grotesque md:w-1/3"
                                dangerouslySetInnerHTML={{ __html: section.title }}
                            />
                            <p className="text-lg md:text-xl lg:text-2xl font-light font-darker-grotesque md:w-2/3 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}