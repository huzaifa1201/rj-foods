
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { PageContent } from '../types';
import { defaultPages } from '../utils/dummyData';
import { PageLoader, Button, Card } from '../components/UI';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      try {
        // 1. Try to fetch from Database (Admin edits)
        const docRef = doc(db, 'content_pages', slug);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPage({ id: docSnap.id, ...docSnap.data() } as PageContent);
        } else {
          // 2. If not in DB, fallback to Default Data (Hardcoded)
          const defaultPage = defaultPages.find(p => p.id === slug);
          if (defaultPage) {
             setPage({ ...defaultPage, updatedAt: null } as PageContent);
          } else {
             setPage(null);
          }
        }
      } catch (error) {
        console.error("Error fetching page:", error);
        // Fallback on error as well
        const defaultPage = defaultPages.find(p => p.id === slug);
        if (defaultPage) {
           setPage({ ...defaultPage, updatedAt: null } as PageContent);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) return <PageLoader />;

  if (!page) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-2xl font-bold text-darkGray mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-6">The page "{slug}" does not exist.</p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8"
    >
      <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors w-fit">
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <Card className="p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
          <div className="p-3 bg-primaryLight text-primary rounded-xl">
            <FileText size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-darkGray">{page.title}</h1>
        </div>

        <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">
          {page.content}
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-100 text-sm text-gray-400 italic flex justify-between">
           <span>{page.updatedAt ? `Last Updated: ${new Date(page.updatedAt.seconds * 1000).toLocaleDateString()}` : 'Standard Policy'}</span>
           <span className="text-primary text-xs bg-primaryLight px-2 py-1 rounded">
             {page.updatedAt ? 'Customized' : 'Default Template'}
           </span>
        </div>
      </Card>
    </motion.div>
  );
};
