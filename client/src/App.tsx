
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/utils/trpc';
import type { 
  HeroSection, 
  ServiceAdvantage, 
  ServiceOffering, 
  Package, 
  MenuItem, 
  GalleryPhoto, 
  FAQ, 
  ContactInfo 
} from '../../server/src/schema';

function App() {
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [serviceAdvantages, setServiceAdvantages] = useState<ServiceAdvantage[]>([]);
  const [serviceOfferings, setServiceOfferings] = useState<ServiceOffering[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        heroData,
        advantagesData,
        offeringsData,
        packagesData,
        menuData,
        galleryData,
        faqsData,
        contactData
      ] = await Promise.all([
        trpc.getHeroSection.query(),
        trpc.getServiceAdvantages.query(),
        trpc.getServiceOfferings.query(),
        trpc.getPackages.query(),
        trpc.getMenuItems.query(),
        trpc.getGalleryPhotos.query(),
        trpc.getFAQs.query(),
        trpc.getContactInfo.query()
      ]);

      setHeroSection(heroData);
      setServiceAdvantages(advantagesData);
      setServiceOfferings(offeringsData);
      setPackages(packagesData);
      setMenuItems(menuData);
      setGalleryPhotos(galleryData);
      setFaqs(faqsData);
      setContactInfo(contactData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleWhatsAppContact = (message?: string) => {
    // Use contact info if available, otherwise fallback
    const whatsappNumber = contactInfo?.whatsapp_number || heroSection?.whatsapp_number || '6281234567890';
    const defaultMessage = message || heroSection?.whatsapp_message || 'Assalamu\'alaikum. Saya tertarik dengan layanan Aqiqah Anda.';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        {heroSection?.background_image_url && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${heroSection.background_image_url})` }}
          />
        )}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {heroSection?.title || '🐐 Layanan Aqiqah Terpercaya di Pekanbaru'}
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            {heroSection?.subtitle || 'Melayani dengan Penuh Berkah dan Amanah'}
          </p>
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
            {heroSection?.description || 'Kami menyediakan layanan aqiqah lengkap dengan daging berkualitas, pengolahan higienis, dan pelayanan yang memuaskan sesuai syariat Islam.'}
          </p>
          <Button 
            onClick={() => handleWhatsAppContact()}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            💬 Hubungi via WhatsApp
          </Button>
        </div>
      </section>

      {/* Service Advantages */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ✨ Keunggulan Layanan Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dipercaya ribuan keluarga di Pekanbaru untuk momen aqiqah yang berkah
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceAdvantages.length > 0 ? (
              serviceAdvantages.map((advantage: ServiceAdvantage) => (
                <Card key={advantage.id} className="hover:shadow-lg transition-shadow duration-200 border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="text-4xl mb-2">{advantage.icon_name || '⭐'}</div>
                    <CardTitle className="text-emerald-700">{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{advantage.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback content when no data available
              <>
                <Card className="hover:shadow-lg transition-shadow duration-200 border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="text-4xl mb-2">🥩</div>
                    <CardTitle className="text-emerald-700">Daging Berkualitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Daging kambing/domba pilihan, segar dan halal, langsung dari peternak terpercaya</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-200 border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="text-4xl mb-2">👨‍🍳</div>
                    <CardTitle className="text-emerald-700">Pengolahan Higienis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Dimasak oleh koki berpengalaman dengan standar kebersihan yang tinggi</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-200 border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="text-4xl mb-2">🚚</div>
                    <CardTitle className="text-emerald-700">Antar Gratis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Pengantaran gratis ke seluruh wilayah Pekanbaru dengan kemasan yang rapi</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Service Offerings */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🍽️ Layanan Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai pilihan layanan aqiqah sesuai kebutuhan dan tradisi keluarga
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceOfferings.length > 0 ? (
              serviceOfferings.map((offering: ServiceOffering) => (
                <Card key={offering.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {offering.image_url && (
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={offering.image_url} 
                        alt={offering.title}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  )}
                  <CardHeader>
                    <CardTitle className="text-emerald-700">{offering.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{offering.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback content
              <>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-emerald-700">Paket Aqiqah Lengkap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Melayani aqiqah dengan kambing/domba pilihan, dimasak sesuai permintaan, dan siap disajikan untuk keluarga dan tetangga.</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-emerald-700">Catering Aqiqah</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Menyediakan hidangan aqiqah dalam bentuk nasi kotak atau prasmanan untuk acara keluarga yang lebih besar.</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              💰 Paket Aqiqah
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pilihan paket lengkap dengan harga terjangkau dan kualitas terbaik
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.length > 0 ? (
              packages.map((pkg: Package) => {
                let features: string[] = [];
                try {
                  features = JSON.parse(pkg.features);
                } catch {
                  features = [pkg.features];
                }
                
                return (
                  <Card key={pkg.id} className={`relative hover:shadow-lg transition-all duration-200 ${pkg.is_popular ? 'ring-2 ring-emerald-500 scale-105' : ''}`}>
                    {pkg.is_popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-500">
                        Paling Populer
                      </Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="text-emerald-700 text-xl">{pkg.name}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                      <div className="text-3xl font-bold text-gray-800">
                        Rp {pkg.price.toLocaleString('id-ID')}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <span className="text-emerald-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        onClick={() => handleWhatsAppContact(`Saya tertarik dengan ${pkg.name}. Mohon informasi lebih lanjut.`)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        Pesan Sekarang
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              // Fallback packages
              <>
                <Card className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="text-emerald-700 text-xl">Paket Ekonomis</CardTitle>
                    <CardDescription>Cocok untuk keluarga kecil</CardDescription>
                    <div className="text-3xl font-bold text-gray-800">
                      Rp 1.500.000
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-gray-600">
                        <span className="text-emerald-500 mr-2">✓</span>
                        1 ekor kambing muda
                      </li>
                      <li className="flex items-center text-gray-600">
                        <span className="text-emerald-500 mr-2">✓</span>
                        Daging dimasak gulai
                      </li>
                      <li className="flex items-center text-gray-600">
                        <span className="text-emerald-500 mr-2">✓</span>
                        Antar gratis
                      </li>
                    </ul>
                    <Button 
                      onClick={() => handleWhatsAppContact('Saya tertarik dengan Paket Ekonomis. Mohon informasi lebih lanjut.')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      Pesan Sekarang
                    </Button>
                  </CardContent>
                </Card>
                <Card className="relative hover:shadow-lg transition-all duration-200 ring-2 ring-emerald-500 scale-105">
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-500">
                    Paling Populer
                  </Badge>
                  <CardHeader>
                    <CardTitle className="text-emerald-700 text-xl">Paket Standar</CardTitle>
                    <CardDescription>Pilihan terbaik untuk keluarga</CardDescription>
                    <div className="text-3xl font-bold text-gray-800">
                      Rp 2.200.000
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-gray-600">
                        <span className="text-emerald-500 mr-2">✓</span>
                        1 ekor kambing dewasa
                      </li>
                      <li className="flex items-center text-gray-600">
                        <span className="text-emerald-500 mr-2">✓</span>
                        Gulai + rendang
                      </li>
                      <li className="flex items-center text-gray-600">
                        <span className="text-emerald-500 mr-2">✓</span>
                        Nasi kotak 50 porsi
                      </li>
                      <li className="flex items-center text-gray-600">
                        <span className="text-emerald-500 mr-2">✓</span>
                        Antar gratis
                      </li>
                    </ul>
                    <Button 
                      onClick={() => handleWhatsAppContact('Saya tertarik dengan Paket Standar. Mohon informasi lebih lanjut.')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      Pesan Sekarang
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="text-emerald-700 text-xl">Paket Premium</CardTitle>
                    <CardDescription>Untuk acara keluarga besar</CardDescription>
                    <div className="text-3xl font-bold text-gray-800">
                      Rp 3.500.000
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-gray-600">
                        <span className="text-emerald-500 mr-2">✓</span>
                        2 ekor kambing dewasa
                      </li>
                      <li className="flex items-center text-gray-600">
                        <span className="text-emerald-500 mr-2">✓</span>
                        Gulai, rendang, dan sate
                      </li>
                      <li className="flex items-center text-gray-600">
                        <span className="text-emerald-500 mr-2">✓</span>
                        Nasi kotak 100 porsi
                      </li>
                      <li className="flex items-center text-gray-600">
                        <span className="text-emerald-500 mr-2">✓</span>
                        Antar gratis + setup
                      </li>
                    </ul>
                    <Button 
                      onClick={() => handleWhatsAppContact('Saya tertarik dengan Paket Premium. Mohon informasi lebih lanjut.')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      Pesan Sekarang
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🍖 Menu Pilihan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai olahan daging kambing/domba yang lezat dan halal
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.length > 0 ? (
              menuItems.map((item: MenuItem) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {item.image_url && (
                    <AspectRatio ratio={4 / 3}>
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-emerald-700">{item.name}</CardTitle>
                      {item.is_halal_certified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Halal
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {item.category}
                    </Badge>
                  </CardHeader>
                  {item.description && (
                    <CardContent>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              // Fallback menu items
              <>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-emerald-700">Gulai Kambing</CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Halal
                      </Badge>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      Makanan Utama
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Gulai kambing dengan rempah tradisional Minang yang kaya cita rasa</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-emerald-700">Rendang Daging</CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Halal
                      </Badge>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      Makanan Utama
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Rendang dengan bumbu khas Padang yang dimasak hingga empuk</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-emerald-700">Sate Kambing</CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Halal
                      </Badge>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      Makanan Ringan
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Sate kambing bakar dengan bumbu kacang yang gurih dan pedas</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              📸 Galeri Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dokumentasi layanan aqiqah kami dan kepuasan pelanggan
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryPhotos.length > 0 ? (
              galleryPhotos.map((photo: GalleryPhoto) => (
                <div key={photo.id} className="group cursor-pointer">
                  <AspectRatio ratio={1}>
                    <img 
                      src={photo.thumbnail_url || photo.image_url} 
                      alt={photo.title || 'Gallery image'}
                      className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg"
                    />
                  </AspectRatio>
                  {photo.title && (
                    <p className="text-center mt-2 text-gray-700 font-medium">{photo.title}</p>
                  )}
                  {photo.description && (
                    <p className="text-center text-sm text-gray-500">{photo.description}</p>
                  )}
                </div>
              ))
            ) : (
              // Fallback gallery images
              <>
                <div className="group cursor-pointer">
                  <AspectRatio ratio={1}>
                    <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-teal-200 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg">
                      <span className="text-6xl">🐐</span>
                    </div>
                  </AspectRatio>
                  <p className="text-center mt-2 text-gray-700 font-medium">Kambing Pilihan</p>
                </div>
                <div className="group cursor-pointer">
                  <AspectRatio ratio={1}>
                    <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg">
                      <span className="text-6xl">🍲</span>
                    </div>
                  </AspectRatio>
                  <p className="text-center mt-2 text-gray-700 font-medium">Proses Memasak</p>
                </div>
                <div className="group cursor-pointer">
                  <AspectRatio ratio={1}>
                    <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg">
                      <span className="text-6xl">📦</span>
                    </div>
                  </AspectRatio>
                  <p className="text-center mt-2 text-gray-700 font-medium">Kemasan Rapi</p>
                </div>
                <div className="group cursor-pointer">
                  <AspectRatio ratio={1}>
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg">
                      <span className="text-6xl">🚚</span>
                    </div>
                  </AspectRatio>
                  <p className="text-center mt-2 text-gray-700 font-medium">Pengantaran</p>
                </div>
                <div className="group cursor-pointer">
                  <AspectRatio ratio={1}>
                    <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg">
                      <span className="text-6xl">😊</span>
                    </div>
                  </AspectRatio>
                  <p className="text-center mt-2 text-gray-700 font-medium">Pelanggan Puas</p>
                </div>
                <div className="group cursor-pointer">
                  <AspectRatio ratio={1}>
                    <div className="w-full h-full bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 shadow-lg">
                      <span className="text-6xl">🤝</span>
                    </div>
                  </AspectRatio>
                  <p className="text-center mt-2 text-gray-700 font-medium">Pelayanan Terbaik</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ❓ Pertanyaan Umum
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jawaban untuk pertanyaan yang sering diajukan seputar layanan aqiqah kami
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.length > 0 ? (
              faqs.map((faq: FAQ) => (
                <AccordionItem key={faq.id}  value={`item-${faq.id}`} className="bg-white rounded-lg px-6 border-0 shadow-sm">
                  <AccordionTrigger className="text-left font-semibold text-emerald-700 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              // Fallback FAQ items
              <>
                <AccordionItem value="item-1" className="bg-white rounded-lg px-6 border-0 shadow-sm">
                  <AccordionTrigger className="text-left font-semibold text-emerald-700 hover:no-underline">
                    Berapa lama waktu pemesanan minimal sebelum acara aqiqah?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    Kami merekomendasikan pemesanan minimal 3 hari sebelum acara untuk memastikan persiapan yang optimal. Namun, untuk kondisi mendesak, kami dapat melayani pemesanan H-1 dengan ketersediaan yang terbatas.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-white rounded-lg px-6 border-0 shadow-sm">
                  <AccordionTrigger className="text-left font-semibold text-emerald-700 hover:no-underline">
                    Apakah daging yang digunakan sudah dipastikan halal?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    Ya, semua daging kambing/domba yang kami gunakan dijamin halal dan berasal dari peternak terpercaya. Proses penyembelihan dilakukan sesuai syariat Islam dengan menyebut nama Allah SWT.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="bg-white rounded-lg px-6 border-0 shadow-sm">
                  <AccordionTrigger className="text-left font-semibold text-emerald-700 hover:no-underline">
                    Bagaimana sistem pembayaran yang tersedia?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    Kami menerima pembayaran secara tunai, transfer bank, dan e-wallet. Untuk pemesanan, cukup membayar uang muka 50% dan sisanya dapat dibayar saat pengantaran.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="bg-white rounded-lg px-6 border-0 shadow-sm">
                  <AccordionTrigger className="text-left font-semibold text-emerald-700 hover:no-underline">
                    Wilayah mana saja yang dilayani untuk pengantaran gratis?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    Kami melayani pengantaran gratis untuk seluruh wilayah Pekanbaru dan sekitarnya. Untuk wilayah di luar Pekanbaru, akan dikenakan biaya tambahan sesuai jarak tempuh.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="bg-white rounded-lg px-6 border-0 shadow-sm">
                  <AccordionTrigger className="text-left font-semibold text-emerald-700 hover:no-underline">
                    Bisakah meminta olahan daging sesuai selera keluarga?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">
                    Tentu saja! Kami dapat menyesuaikan tingkat kepedasan dan cara pengolahan sesuai permintaan. Silakan informasikan preferensi Anda saat melakukan pemesanan.
                  </AccordionContent>
                </AccordionItem>
              </>
            )}
          </Accordion>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            🌟 Siap Melayani Aqiqah Terbaik untuk Keluarga Anda
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Hubungi kami sekarang untuk konsultasi dan pemesanan layanan aqiqah
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => handleWhatsAppContact()}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              💬 Chat WhatsApp
            </Button>
            <Button 
              onClick={() => {
                const phoneNumber = contactInfo?.phone_number || '081234567890';
                window.open(`tel:${phoneNumber}`, '_self');
              }}
              variant="outline" 
              className="bg-white/10 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg rounded-full backdrop-blur-sm"
            >
              📞 Telepon Langsung
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-emerald-400">
                🐐 Aqiqah Pekanbaru
              </h3>
              <p className="text-gray-300 mb-4">
                Melayani aqiqah dengan penuh berkah dan amanah untuk keluarga di Pekanbaru dan sekitarnya.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Kontak</h4>
              <div className="space-y-2 text-gray-300">
                <p>📍 {contactInfo?.address || 'Pekanbaru, Riau'}</p>
                <p>📞 {contactInfo?.phone_number || '0761-123456'}</p>
                <p>📱 {contactInfo?.whatsapp_number || '081234567890'}</p>
                {contactInfo?.email && <p>✉️ {contactInfo.email}</p>}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-emerald-400">Jam Operasional</h4>
              <p className="text-gray-300">
                {contactInfo?.operating_hours || 'Senin - Minggu: 08:00 - 20:00 WIB'}
              </p>
            </div>
          </div>
          <Separator className="my-8 bg-gray-600" />
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Aqiqah Pekanbaru. Semua hak dilindungi.</p>
            <p className="mt-2">Melayani dengan ❤️ dan penuh berkah</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
