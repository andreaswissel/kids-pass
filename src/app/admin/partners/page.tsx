import { prisma } from "@/lib/prisma";
import { Card, Button, Badge } from "@/components/ui";
import Link from "next/link";
import { Plus, Edit, MapPin, Mail, Phone } from "lucide-react";

async function getPartners() {
  return prisma.partner.findMany({
    include: {
      _count: {
        select: { activities: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-kidspass-text">Partners</h1>
          <p className="text-kidspass-text-muted">
            Manage activity providers on the platform
          </p>
        </div>
        <Link href="/admin/partners/new">
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Add Partner
          </Button>
        </Link>
      </div>

      {partners.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <Card key={partner.id} padding="md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-kidspass-text">{partner.name}</h3>
                  <Badge variant="default" size="sm">
                    {partner._count.activities} activities
                  </Badge>
                </div>
                <Link href={`/admin/partners/${partner.id}`}>
                  <button className="p-2 hover:bg-bg-cream rounded-full transition-colors">
                    <Edit className="h-4 w-4 text-kidspass-text-muted" />
                  </button>
                </Link>
              </div>

              {partner.description && (
                <p className="text-sm text-kidspass-text-muted mb-3 line-clamp-2">
                  {partner.description}
                </p>
              )}

              <div className="space-y-1 text-sm text-kidspass-text-muted">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{partner.address}, {partner.city}</span>
                </div>
                {partner.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{partner.contactEmail}</span>
                  </div>
                )}
                {partner.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{partner.contactPhone}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <p className="text-5xl mb-4">🏢</p>
          <h3 className="text-xl font-bold text-kidspass-text mb-2">
            No partners yet
          </h3>
          <p className="text-kidspass-text-muted mb-6">
            Add your first partner to start offering activities
          </p>
          <Link href="/admin/partners/new">
            <Button>Add Your First Partner</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

