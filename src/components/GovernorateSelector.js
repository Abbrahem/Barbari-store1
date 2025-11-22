import React from 'react';

const GovernorateSelector = ({ selectedGovernorate, onGovernorateChange, className = "" }) => {
  const governorates = [
    // وجه بحري (دلتا + شمال) - 70 جنيه
    { name: 'القاهرة', price: 70, region: 'delta_north' },
    { name: 'الجيزة', price: 70, region: 'delta_north' },
    { name: 'القليوبية', price: 70, region: 'delta_north' },
    { name: 'الإسكندرية', price: 70, region: 'delta_north' },
    { name: 'البحيرة', price: 70, region: 'delta_north' },
    { name: 'كفر الشيخ', price: 70, region: 'delta_north' },
    { name: 'الدقهلية', price: 70, region: 'delta_north' },
    { name: 'الشرقية', price: 70, region: 'delta_north' },
    { name: 'الغربية', price: 70, region: 'delta_north' },
    { name: 'المنوفية', price: 70, region: 'delta_north' },
    { name: 'دمياط', price: 70, region: 'delta_north' },
    { name: 'بورسعيد', price: 70, region: 'delta_north' },
    { name: 'الإسماعيلية', price: 70, region: 'delta_north' },
    { name: 'السويس', price:50,region: 'delta_north' },
    { name: 'شمال سيناء', price: 70, region: 'delta_north' },
    { name: 'جنوب سيناء', price: 70, region: 'delta_north' },
    { name: 'مرسى مطروح', price: 70, region: 'delta_north' },
    
    // وجه قبلي (الصعيد) - 120 جنيه
    { name: 'بني سويف', price: 120, region: 'upper_egypt' },
    { name: 'الفيوم', price: 120, region: 'upper_egypt' },
    { name: 'المنيا', price: 120, region: 'upper_egypt' },
    { name: 'أسيوط', price: 120, region: 'upper_egypt' },
    { name: 'سوهاج', price: 120, region: 'upper_egypt' },
    { name: 'قنا', price: 120, region: 'upper_egypt' },
    { name: 'الأقصر', price: 120, region: 'upper_egypt' },
    { name: 'أسوان', price: 120, region: 'upper_egypt' },
    { name: 'البحر الأحمر', price: 120, region: 'upper_egypt' },
    { name: 'الوادي الجديد', price: 120, region: 'upper_egypt' }
  ];

  const handleChange = (e) => {
    const selectedName = e.target.value;
    const selectedGov = governorates.find(gov => gov.name === selectedName);
    onGovernorateChange(selectedGov);
  };

  return (
    <div className={`w-full ${className}`}>
      <label htmlFor="governorate" className="block text-sm font-medium text-white mb-2">
        اختر المحافظة
      </label>
      <select
        id="governorate"
        value={selectedGovernorate?.name || ''}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white text-right"
        required
      >
        <option value="" disabled>اختر المحافظة...</option>
        
        {/* وجه بحري */}
        <optgroup label="وجه بحري (دلتا + شمال) - 70 جنيه">
          <option value="القاهرة">القاهرة</option>
          <option value="الجيزة">الجيزة</option>
          <option value="القليوبية">القليوبية</option>
          <option value="الإسكندرية">الإسكندرية</option>
          <option value="البحيرة">البحيرة</option>
          <option value="كفر الشيخ">كفر الشيخ</option>
          <option value="الدقهلية">الدقهلية</option>
          <option value="الشرقية">الشرقية</option>
          <option value="الغربية">الغربية</option>
          <option value="المنوفية">المنوفية</option>
          <option value="دمياط">دمياط</option>
          <option value="بورسعيد">بورسعيد</option>
          <option value="الإسماعيلية">الإسماعيلية</option>
          <option value="السويس">السويس</option>
          <option value="شمال سيناء">شمال سيناء</option>
          <option value="جنوب سيناء">جنوب سيناء</option>
          <option value="مرسى مطروح">مرسى مطروح</option>
        </optgroup>
        
        {/* وجه قبلي */}
        <optgroup label="وجه قبلي (الصعيد) - 120 جنيه">
          <option value="بني سويف">بني سويف</option>
          <option value="الفيوم">الفيوم</option>
          <option value="المنيا">المنيا</option>
          <option value="أسيوط">أسيوط</option>
          <option value="سوهاج">سوهاج</option>
          <option value="قنا">قنا</option>
          <option value="الأقصر">الأقصر</option>
          <option value="أسوان">أسوان</option>
          <option value="البحر الأحمر">البحر الأحمر</option>
          <option value="الوادي الجديد">الوادي الجديد</option>
        </optgroup>
      </select>
      
      {selectedGovernorate && (
        <div className="mt-2 text-sm text-gray-300">
          رسوم التوصيل: <span className="font-semibold text-white">{selectedGovernorate.price} جنيه مصري</span>
        </div>
      )}
    </div>
  );
};

export default GovernorateSelector;
