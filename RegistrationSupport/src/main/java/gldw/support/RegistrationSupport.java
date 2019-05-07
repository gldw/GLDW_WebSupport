package gldw.support;

import com.lcrc.af.AnalysisCompoundData;
import com.lcrc.af.AnalysisData;
import com.lcrc.af.AnalysisEvent;
import com.lcrc.af.constants.LogLevel;
import com.lcrc.af.datatypes.LogMessage;
import com.lcrc.af.util.StringUtility;

import vdab.api.event.VDABData;
import vdab.api.node.JavaFunctionSet_A;

public class RegistrationSupport extends JavaFunctionSet_A {

	private final static String PATH_USERNAME= ".Username";
	private final static String PATH_FIRSTNAME= ".FirstName";
	private final static String PATH_LASTNAME= ".LastName";
	private final static String PATH_ADDRESS1= ".AddressLine1";
	private final static String PATH_ADDRESS2= ".AddressLine2";
	private final static String PATH_CITY= ".City";
	private final static String PATH_POSTALCODE= ".PostalCode";
	private final static String PATH_SERVERS= ".RequestedVDABServers";
	private final static String PATH_EMAIL= ".EMail";
	private final static String PATH_ORGNAME= ".Organizationname";
	private final static String PATH_OWNER= ".Owner";
	private final static String PATH_SOURCE= ".TappedSource";
	private final static String PATH_LOCATION= ".TappedLocation";
	
	public  VDABData func_validateUserRegistration(VDABData inData, String basePath){
		
		// Check AccountName
		String account = inData.getDataAsString(basePath+PATH_USERNAME);
		if (account == null || account.length() < 2){
			pushError("did not include a proper username of at least 2 characters");
			return null;
		}

		// Check Email
		String email = inData.getDataAsString(basePath+PATH_EMAIL);
		String errInfo = validateEmail(email);
		if (errInfo != null){
			pushError(errInfo);
			return null;
		}
		
		//Check FirstName
		String firstname = inData.getDataAsString(basePath+PATH_FIRSTNAME);
		if (firstname == null || firstname.length() < 2){
			pushError("did not include a proper first name of at least 2 characters");
			return null;
		}
		
		String lastname = inData.getDataAsString(basePath+PATH_LASTNAME);
		if (lastname == null || lastname.length() < 2){
			pushError("did not include a proper last name of at least 2 characters");
			return null;
		}
		
		String Address = inData.getDataAsString(basePath+PATH_ADDRESS1)+" "+inData.getDataAsString(basePath+PATH_ADDRESS2);
		if (Address == null || Address.length() < 2){
			pushError("did not include a proper address of at least 2 characters");
			return null;
		}
		
		String City = inData.getDataAsString(basePath+PATH_CITY);
		if (City == null || City.length() < 2){
			pushError("did not include a proper city of at least 2 characters");
			return null;
		}
		
		String postalcode = inData.getDataAsString(basePath+PATH_POSTALCODE);
		if (postalcode == null || postalcode.length() < 2){
			pushError("did not include a proper postalcode of at least 2 characters");
			return null;
		}
	
		return inData;
	}
	
	public  VDABData func_validateOrgRegistration(VDABData inData, String basePath){
		
		String account = inData.getDataAsString(basePath+PATH_ORGNAME);
		if (account == null || account.length() < 2){
			pushError("did not include a proper organization name of at least 2 characters");
			return null;
		}
		
		return inData;
	}

	public  VDABData func_validateSourceRegistration(VDABData inData, String basePath){
	
		String account = inData.getDataAsString(basePath+PATH_OWNER);
		if (account == null || account.length() < 7){
			pushError("did not include a proper owner of at least seven characters");
			return null;
		}
	
		return inData;
	}
	
	public  VDABData func_validateTapRegistration(VDABData inData, String basePath){
		
		String account = inData.getDataAsString(basePath+PATH_OWNER);
		if (account == null || account.length() < 7){
			pushError("did not include a proper owner of at least seven characters");
			return null;
		}
		
		String source = inData.getDataAsString(basePath+PATH_SOURCE);
		if (source == null){
			pushError("did not include a proper data source");
			return null;
		}
		
		String location = inData.getDataAsString(basePath+PATH_LOCATION);
		if (location == null){
			pushError("did not include a proper location");
			return null;
		}
		
		return inData;
	}
	private String validateEmail(String email){
		int pos1 = email.indexOf("@");
		int pos2 = email.indexOf(".");	
		if (pos1 < 1 || pos2 < 1)
			return "improperly formatted Email address";
		return null;
	}


}
