#!/bin/bash

# Premium Kullanıcı Yönetim Script'i
# Kullanım: ./manage-premium.sh [upgrade|downgrade|check] [user-email]

ADMIN_KEY="your-admin-secret-key-here"  # .env'den ADMIN_SECRET_KEY ile aynı olmalı
API_URL="http://localhost:3000"  # Production için: https://your-domain.com

# Renk kodları
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ $# -lt 2 ]; then
    echo -e "${RED}Kullanım: $0 [upgrade|downgrade|check] [user-email]${NC}"
    echo ""
    echo "Örnekler:"
    echo "  $0 upgrade user@example.com"
    echo "  $0 downgrade user@example.com"
    echo "  $0 check user@example.com"
    exit 1
fi

ACTION=$1
USER_EMAIL=$2

# Supabase'den user ID'yi al (Supabase dashboard'dan manuel alınmalı)
echo -e "${YELLOW}Not: User ID'yi Supabase Dashboard > Authentication > Users'dan alın${NC}"
read -p "User ID girin: " USER_ID

if [ -z "$USER_ID" ]; then
    echo -e "${RED}User ID boş olamaz!${NC}"
    exit 1
fi

case $ACTION in
    upgrade)
        echo -e "${YELLOW}Premium'a yükseltiliyor: $USER_EMAIL ($USER_ID)${NC}"
        RESPONSE=$(curl -s -X POST "$API_URL/api/admin/subscription" \
            -H "Authorization: Bearer $ADMIN_KEY" \
            -H "Content-Type: application/json" \
            -d "{\"userId\":\"$USER_ID\",\"action\":\"upgrade\"}")
        
        if echo "$RESPONSE" | grep -q "success"; then
            echo -e "${GREEN}✅ Başarılı! Kullanıcı premium'a yükseltildi.${NC}"
            echo "$RESPONSE" | jq '.'
        else
            echo -e "${RED}❌ Hata oluştu!${NC}"
            echo "$RESPONSE" | jq '.'
        fi
        ;;
    
    downgrade)
        echo -e "${YELLOW}Free'ye düşürülüyor: $USER_EMAIL ($USER_ID)${NC}"
        RESPONSE=$(curl -s -X POST "$API_URL/api/admin/subscription" \
            -H "Authorization: Bearer $ADMIN_KEY" \
            -H "Content-Type: application/json" \
            -d "{\"userId\":\"$USER_ID\",\"action\":\"downgrade\"}")
        
        if echo "$RESPONSE" | grep -q "success"; then
            echo -e "${GREEN}✅ Başarılı! Kullanıcı free'ye düşürüldü.${NC}"
            echo "$RESPONSE" | jq '.'
        else
            echo -e "${RED}❌ Hata oluştu!${NC}"
            echo "$RESPONSE" | jq '.'
        fi
        ;;
    
    check)
        echo -e "${YELLOW}Subscription kontrol ediliyor: $USER_EMAIL ($USER_ID)${NC}"
        RESPONSE=$(curl -s -X GET "$API_URL/api/admin/subscription?userId=$USER_ID" \
            -H "Authorization: Bearer $ADMIN_KEY")
        
        echo "$RESPONSE" | jq '.'
        ;;
    
    *)
        echo -e "${RED}Geçersiz aksiyon: $ACTION${NC}"
        echo "Kullanım: $0 [upgrade|downgrade|check] [user-email]"
        exit 1
        ;;
esac
