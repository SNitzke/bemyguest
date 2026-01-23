import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  FileText, 
  MessageSquare, 
  Bell,
  BarChart3,
  Shield,
  CreditCard,
  ArrowRight,
  CheckCircle,
  Home,
  Wrench,
  Calendar
} from 'lucide-react';

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('landlord');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4" variant="secondary">
            Vista Previa de la Plataforma
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Descubre BeMyGuest
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explora todas las funcionalidades que tendrás disponibles para gestionar 
            tus propiedades de manera eficiente y profesional.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Comenzar Gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
              Ver Planes
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Tabs */}
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="landlord" className="gap-2">
              <Building2 className="h-4 w-4" />
              Vista Propietario
            </TabsTrigger>
            <TabsTrigger value="tenant" className="gap-2">
              <Users className="h-4 w-4" />
              Vista Inquilino
            </TabsTrigger>
          </TabsList>

          {/* Landlord Demo */}
          <TabsContent value="landlord" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Panel del Propietario</h2>
              <p className="text-muted-foreground">
                Gestiona todas tus propiedades desde un solo lugar
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Propiedades</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">28</p>
                      <p className="text-sm text-muted-foreground">Inquilinos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-amber-500/10">
                      <Wrench className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Tickets Abiertos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">$45,200</p>
                      <p className="text-sm text-muted-foreground">Ingresos/mes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Building2 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Gestión de Propiedades</CardTitle>
                  <CardDescription>
                    Agrega, edita y organiza todas tus propiedades con fotos, 
                    detalles y documentos importantes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Múltiples unidades por propiedad
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Fotos y documentos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Estado de ocupación
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Gestión de Inquilinos</CardTitle>
                  <CardDescription>
                    Administra contratos, pagos y comunicación con tus 
                    inquilinos de forma centralizada.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Invitaciones por email
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Historial de pagos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Contratos digitales
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CreditCard className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Control de Pagos</CardTitle>
                  <CardDescription>
                    Registra y da seguimiento a todos los pagos de renta 
                    y servicios adicionales.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Recordatorios automáticos
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Historial completo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Reportes financieros
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Wrench className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Tickets de Mantenimiento</CardTitle>
                  <CardDescription>
                    Recibe y gestiona reportes de problemas directamente 
                    desde la aplicación.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Fotos del problema
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Prioridades y estados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Historial de resolución
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Reportes y Análisis</CardTitle>
                  <CardDescription>
                    Visualiza el rendimiento de tus propiedades con gráficas 
                    y reportes detallados.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Ingresos mensuales
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Ocupación histórica
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Exportar a Excel
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <MessageSquare className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Mensajería Integrada</CardTitle>
                  <CardDescription>
                    Comunícate directamente con tus inquilinos sin salir 
                    de la plataforma.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Chat en tiempo real
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Historial de conversaciones
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Notificaciones push
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tenant Demo */}
          <TabsContent value="tenant" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Panel del Inquilino</h2>
              <p className="text-muted-foreground">
                Todo lo que necesitas para gestionar tu renta en un solo lugar
              </p>
              <Badge variant="outline" className="mt-2">
                ¡Gratis para inquilinos!
              </Badge>
            </div>

            {/* Tenant Stats */}
            <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Home className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">Depto 4B</p>
                      <p className="text-sm text-muted-foreground">Mi unidad</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">5 días</p>
                      <p className="text-sm text-muted-foreground">Próximo pago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">$8,500</p>
                      <p className="text-sm text-muted-foreground">Renta mensual</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tenant Features */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CreditCard className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Pagos Simplificados</CardTitle>
                  <CardDescription>
                    Consulta tu historial de pagos y recibe recordatorios automáticos.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Wrench className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Reportar Problemas</CardTitle>
                  <CardDescription>
                    Envía tickets de mantenimiento con fotos directamente a tu propietario.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <MessageSquare className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Comunicación Directa</CardTitle>
                  <CardDescription>
                    Chat integrado para comunicarte con tu propietario de forma rápida.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>
                    Accede a tu contrato y documentos importantes cuando los necesites.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Bell className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>
                    Recibe alertas de pagos próximos, mensajes y actualizaciones.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Seguro y Privado</CardTitle>
                  <CardDescription>
                    Tu información está protegida con los más altos estándares de seguridad.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center py-12 px-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Únete a cientos de propietarios que ya gestionan sus propiedades 
            de forma más eficiente con BeMyGuest.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Crear Cuenta Gratis
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
              Ver Precios
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate('/login')}>
              Ya tengo cuenta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
