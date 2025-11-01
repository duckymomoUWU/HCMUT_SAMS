import React from 'react';
import { cn } from '../../utils/cn';

const AuthFooter: React.FC = () => {
  return (
    <footer className="w-full mt-auto">
      {/* Main Footer - Blue background */}
      <div className="bg-[#4C9BE4] py-4 sm:py-6 lg:py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-white text-center sm:text-left">
            <h3 className={cn(
              "font-black mb-1 sm:mb-2",
              "text-xs sm:text-sm lg:text-[13px]"
            )}>
              Tổ kỹ thuật / Technician
            </h3>
            <div className={cn(
              "font-semibold space-y-0.5 sm:space-y-1",
              "text-xs sm:text-sm lg:text-[13px]"
            )}>
              <p>Email: ddthu@hcmut.edu.vn</p>
              <p>ĐT (Tel.): (84-8) 38647256 - 5258</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer - Dark blue */}
      <div className="bg-[#3E8FDA] h-[20px] sm:h-[25px] lg:h-[33px]"></div>
    </footer>
  );
};

export default AuthFooter;
