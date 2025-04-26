// src/components/ArticleModal.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Label } from '@/components/ui/label.jsx';
import { Input } from '@/components/ui/input.jsx';
import DialogProvider from '@/utils/DialogProvider.jsx';
import { createNewsItem } from '@/utils/functions/newsFunctions.js';

const DEFAULT_COVER = 'default-ui-image-placeholder.webp';

/**
 * Modal for uploading a news article with live image preview.
 */
export default function ArticleModal({ isOpen, onClose, onSave }) {
    const [article, setArticle] = useState({
        title: '',
        summary: '',
        link: '',
        category: '',
        source: '',
        coverImageUrl: '',
    });

    // Reset form when opened/closed
    useEffect(() => {
        if (!isOpen) {
            setArticle({
                title: '',
                summary: '',
                link: '',
                category: '',
                source: '',
                coverImageUrl: '',
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setArticle({ ...article, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setArticle((prev) => ({ ...prev, coverImageUrl: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleConfirm = async () => {
        // Add publishedAt on save
        const saved = await createNewsItem({
            ...article,
            publishedAt: new Date().toISOString(),
        });
        onSave(saved);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <DialogProvider
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title="Upload News Article"
            description="Fill in article details and choose a cover image."
            onConfirm={handleConfirm}
            onCancel={onClose}
            confirmText="Upload"
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleConfirm();
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Left: Article fields */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={article.title}
                            onChange={handleChange}
                            required
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="summary">Summary</Label>
                        <textarea
                            id="summary"
                            name="summary"
                            value={article.summary}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                            rows={4}
                        />
                    </div>
                    <div>
                        <Label htmlFor="link">Link</Label>
                        <Input
                            id="link"
                            name="link"
                            type="url"
                            value={article.link}
                            onChange={handleChange}
                            required
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            name="category"
                            value={article.category}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="source">Source</Label>
                        <Input
                            id="source"
                            name="source"
                            value={article.source}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label htmlFor="coverImage">Cover Image</Label>
                        <input
                            id="coverImage"
                            name="coverImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Right: Image preview */}
                <div className="flex items-center justify-center">
                    <img
                        src={article.coverImageUrl || DEFAULT_COVER}
                        alt="Cover Preview"
                        className="rounded shadow w-full h-64 object-cover"
                    />
                </div>
            </form>
        </DialogProvider>
    );
}

ArticleModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};
