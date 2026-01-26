{/* Meet Our Team Section */}
<section className="py-16 md:py-24 bg-background">
  <div className="container mx-auto px-4 max-w-5xl text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
      Meet Our Team
    </h2>

    {/* Changed md:grid-cols-3 -> md:grid-cols-2 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* Owner */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-foreground">
          Dr. Bhagirathchand Solanki
        </h3>
        <p className="font-semibold text-red-500">Owner</p>
        <p className="text-muted-foreground leading-relaxed">
          Dr. Solanki takes care of the expenses and resources required to keep 
          the website running. He ensures that the platform remains active, 
          reliable, and accessible for users. His support helps maintain smooth 
          operations, regular updates, and continued improvements for PDFMingle.
        </p>
      </div>

      {/* Founder & Developer */}
      <div className="space-y-3 flex flex-col items-center">
        <h3 className="text-2xl font-bold text-foreground">
          Widhia Solanki
        </h3>

        {/* Updated Title */}
        <p className="font-semibold text-red-500">
          Founder & Developer
        </p>

        <p className="text-muted-foreground leading-relaxed">
          Widhia Solanki founded PDFMingle at the age of 18. With strong 
          technical skills, she designs and develops the platform to help 
          students, professionals, and businesses manage documents more 
          efficiently, believing that age doesn't limit the ability to create 
          impactful technology.
        </p>

        <a 
          href="https://www.linkedin.com/in/widhia-solanki-69a901336/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-brand-blue hover:text-brand-blue-dark font-semibold transition-colors"
        >
          <Linkedin className="h-5 w-5" />
          Connect with our Founder
        </a>
      </div>

    </div>
  </div>
</section>
