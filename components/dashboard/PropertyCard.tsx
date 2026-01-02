
import React from 'react';
import { Property, PropertyStatus } from '../../types';
import { Eye, Users, Star, MoreHorizontal, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  property: Property;
}

const PropertyCard: React.FC<Props> = ({ property }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.VERIFIED: return 'bg-green-100 text-green-600';
      case PropertyStatus.REJECTED: return 'bg-red-100 text-reach-red';
      case PropertyStatus.PENDING: return 'bg-orange-100 text-reach-orange';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div 
      onClick={() => navigate(`/property/${property.id}`)}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-transform active:scale-[0.98]"
    >
      <div className="relative h-56">
        <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${getStatusColor(property.status)}`}>
           <div className={`w-1.5 h-1.5 rounded-full ${property.status === PropertyStatus.VERIFIED ? 'bg-green-500' : property.status === PropertyStatus.REJECTED ? 'bg-reach-red' : 'bg-reach-orange'}`} />
           {property.status}
        </div>
        <button className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white">
           <MoreHorizontal size={18} />
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-bold text-lg text-reach-navy leading-tight">{property.title}</h3>
           <div className="flex items-center gap-1 text-reach-orange">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-bold">4.8(20)</span>
           </div>
        </div>

        <div className="flex items-center gap-1.5 text-reach-red mb-3">
           <MapPin size={14} />
           <p className="text-xs font-medium truncate">{property.location}</p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
           <p className="font-bold text-lg text-reach-navy">₦{property.price.toLocaleString()}</p>
           <div className="flex gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                 <Eye size={16} />
                 <span className="text-xs font-semibold">{property.stats.views}</span>
              </div>
              <div className="flex items-center gap-1">
                 <Users size={16} />
                 <span className="text-xs font-semibold">{property.stats.leads}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
