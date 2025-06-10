import Image from "next/image";
import SizeTable from "@/app/components/SizeTable";
import Link from "next/link";

export default function SizeGuidePage() {
    const internationalSizes = [
        { Size: 'XS', US: '2', AUS: '6', UK: '6', EU: '34'},
        { Size: 'S', US: '4', AUS: '8', UK: '8', EU: '36'},
        { Size: 'M', US: '6', AUS: '10', UK: '10', EU: '38'},
        { Size: 'L', US: '8', AUS: '12', UK: '12', EU: '40'},
        { Size: 'XL', US: '10', AUS: '14', UK: '14', EU: '42'},
    ];

    const swimTops = [
        { Size: 'XS', 'Cup Size': 'AA-A', Bust: '78-80cm / 30-32', Waist: '60-64cm / 24-25.5' },
        { Size: 'S', 'Cup Size': 'A-B', Bust: '80-84cm / 32-34', Waist: '64-68cm / 25-26.5' },
        { Size: 'M', 'Cup Size': 'B-C', Bust: '84-88cm / 34-36', Waist: '68-72cm / 26.5-28' },
        { Size: 'L', 'Cup Size': 'C-D', Bust: '88-92cm / 36-38', Waist: '72-76cm / 28-29.5' },
        { Size: 'XL', 'Cup Size': 'D+', Bust: '92-98cm / 38-40', Waist: '76-82cm / 29.5-31' },
    ];

    const swimBottoms = [
        { Size: 'XS', Waist: '58-62cm / 23-24.5', Hips: '84-86cm / 33-34.5' },
        { Size: 'S', Waist: '62-66cm / 24.5-26', Hips: '86-92cm / 34-36' },
        { Size: 'M', Waist: '66-70cm / 26.5-27.5', Hips: '92-96cm / 36-37.5' },
        { Size: 'L', Waist: '70-74cm / 27.5-29', Hips: '96-100cm / 37.5-39' },
        { Size: 'XL', Waist: '74-78cm / 29-31.5', Hips: '100-104cm / 39-40.5' },
    ];

    const onePiece = [
        { Size: 'XS', Bust: '58-62cm / 23-24.5', Waist: '60-64cm / 24-25.5', Hips: '84-86cm / 33-34.5' },
        { Size: 'S', Bust: '80-84cm / 32-34', Waist: '62-66cm / 24.5-26', Hips: '86-92cm / 34-36' },
        { Size: 'M', Bust: '84-88cm / 34-36', Waist: '66-70cm / 26.5-27.5', Hips: '92-96cm / 36-37.5' },
        { Size: 'L', Bust: '88-92cm / 36-38', Waist: '70-74cm / 27.5-29', Hips: '96-100cm / 37.5-39' },
        { Size: 'XL', Bust: '92-98cm / 38-40', Waist: '74-78cm / 29-31.5', Hips: '100-104cm / 39-40.5' },
    ];

    return (
        <div className="flex flex-col items-center mt-19 mb-14">
            <h1 className="text-[32px] sm:text-[36px] md:text-[40px] font-[bero] font-bold tracking-wider leading-none text-center px-4">Size & fit guide</h1>
            <p className="text-[14px] sm:text-[16px] font-darker-grotesque tracking-wider font-medium mt-4 sm:mt-7 text-center px-4 max-w-[600px]">For detailed sizing information and fit notes, refer to the guide below before placing your order.</p>
            <h3 className="text-[28px] sm:text-[32px] md:text-[36px] font-darker-grotesque tracking-wider font-semibold mt-12 sm:mt-16 md:mt-19 text-center px-4">How to measure</h3>
            <div className="flex flex-col items-center mt-5 w-full px-4 sm:px-6 md:px-8">
                <div className="w-full max-w-[728px] space-y-6 sm:space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <h4 className="text-[24px] sm:text-[28px] md:text-[36px] font-darker-grotesque tracking-wider font-semibold">Bust</h4>
                        <p className="text-[18px] sm:text-[22px] md:text-[26px] font-darker-grotesque tracking-wider font-regular">Measure at the fullest part of your bust with no bra on.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <h4 className="text-[24px] sm:text-[28px] md:text-[36px] font-darker-grotesque tracking-wider font-semibold">Waist</h4>
                        <p className="text-[18px] sm:text-[22px] md:text-[26px] font-darker-grotesque tracking-wider font-regular">Measure around the smallest part of your waist.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <h4 className="text-[24px] sm:text-[28px] md:text-[36px] font-darker-grotesque tracking-wider font-semibold">Hips</h4>
                        <p className="text-[18px] sm:text-[22px] md:text-[26px] font-darker-grotesque tracking-wider font-regular">Measure around the fullest part of your hips.</p>
                    </div>
                </div>
                <Image src="/images/size-guide.jpg" alt="How to measure" width={701} height={1052} className="object-contain mt-8 sm:mt-12 md:mt-14 mb-4 w-full max-w-[701px]"/>
                <div className="w-full mb-20">
                    <SizeTable 
                        columns={['Size', 'US', 'AUS', 'UK', 'EU']}
                        data={internationalSizes}
                        title="International Size Chart"
                    />
                    <SizeTable 
                        columns={['Size', 'Cup Size', 'Bust', 'Waist']}
                        data={swimTops}
                        title="Swim Tops"
                    />
                    <SizeTable 
                        columns={['Size', 'Waist', 'Hips']}
                        data={swimBottoms}
                        title="Swim Bottoms"
                    />
                    <SizeTable 
                        columns={['Size', 'Bust', 'Waist', 'Hips']}
                        data={onePiece}
                        title="One Piece"
                    />
                </div>
                <div className="w-full mb-14 flex justify-center px-4">
                    <h4 className="text-[18px] sm:text-[22px] md:text-[26px] font-darker-grotesque max-w-[728px] font-regular text-center leading-7 tracking-wider">
                        This size guide serves as a general guide for helping you find your size. If you are in between sizes, we recommend going up a size as our pieces are on the smaller size. For further assistance, please email us at <Link href="mailto:sizing@kilaeko.com" className="underline decoration-1 underline-offset-4">sizing@kilaeko.com</Link> or check out our <Link href="/contact-us" className="underline decoration-1 underline-offset-4">Contact Us</Link> page for further support options.
                    </h4>
                </div>
            </div>
        </div>
    );
}