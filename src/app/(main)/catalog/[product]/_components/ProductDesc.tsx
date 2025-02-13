import { useState } from "react";

interface Field {
  key: string;
  value: string;
}

interface ProductDescriptionProps {
  content: { fields: Field[] }[]; // Array of objects with fields
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ content }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const { fields } = content[0]; 
  const formatTitle = (key: string): string => 
    key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const toggleSection = (title: string) => 
    setActiveSection(activeSection === title ? null : title);

  return (
    <section className="flex flex-col items-start w-full">
      <div className="flex flex-col gap-8 w-full">
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col gap-4">
            <button 
              onClick={() => toggleSection(field.key)}
              className="flex justify-between items-center w-full text-lg font-medium"
            >
              <h3 className="text-left font-darker-grotesque">
                {formatTitle(field.key)}
              </h3>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/457845678497755f95947fa53956a32a62904e1d6c27e7ae59c48d3c522b9c5c?apiKey=df24f938eeb948889fe9ad55656873a2&"
                alt={activeSection === field.key ? "Collapse" : "Expand"}
                className={`w-[22px] aspect-square object-contain transition-transform duration-300 ${
                  activeSection === field.key ? 'rotate-180' : ''
                }`}
              />
            </button>
            {activeSection === field.key && (
              <div className="text-base font-normal whitespace-pre-line font-darker-grotesque">
                {field.value}
              </div>
            )}
            <div className="w-full border-t border-0.5 border-neutral-800/10" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductDescription;